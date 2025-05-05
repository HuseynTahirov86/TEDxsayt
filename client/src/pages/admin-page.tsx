import { useEffect, useState, useRef } from "react";

// Helper function to safely increment numeric state
const incrementState = (prev: any): number => prev + 1;
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn, queryClient, apiRequest } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Check, 
  Loader2, 
  Mail, 
  Trash, 
  X, 
  FileText, 
  RefreshCw, 
  Download, 
  MessageSquare, 
  Eye, 
  ChevronDown,
  BarChart,
  UserPlus,
  Clock,
  Globe,
  Award,
  MoveVertical,
  Calendar,
  Edit,
  Plus,
  Upload,
  Mic,
  Users,
  ListChecks,
  Database,
  Link,
  ExternalLink,
  Pencil
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form schemas
const sponsorFormSchema = z.object({
  name: z.string().min(2, "Ad ən azı 2 simvol olmalıdır"),
  logo: z.string().min(10, "Logo URL qeyd edilməlidir"),
  website: z.string().optional(),
  level: z.string().min(1, "Sponsorluq səviyyəsi seçilməlidir"),
  order: z.coerce.number().int().min(0, "Sıra nömrəsi müsbət ədəd olmalıdır"),
});

// Registration type
interface Registration {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occupation?: string;
  topics?: string;
  createdAt: string;
}

// Contact type
interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

// Speaker type
interface Speaker {
  id: number;
  name: string;
  title: string;
  bio: string;
  topic: string;
  image: string;
}

// Session type
interface ProgramSession {
  id: string;
  name: string;
}

// Program item type
interface ProgramItem {
  id: number;
  time: string;
  title: string;
  description: string;
  speakerId?: number;
  session: string;
}

// Statistics type
// Sponsor type
interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website?: string;
  level: string;
  order: number;
  createdAt: string;
}

interface Statistics {
  registrationsCount: number;
  contactsCount: number;
  unreadCount: number;
  speakersCount: number;
  programItemsCount: number;
  recentRegistrations: Array<{
    date: string;
    count: number;
  }>;
  topicStats: Array<{
    topic: string;
    count: number;
  }>;
}

// Stats component
function StatsPanel() {
  const { data: registrations } = useQuery<Registration[]>({
    queryKey: ["/api/admin/registrations"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const totalRegistrations = registrations?.length || 0;
  const totalContacts = contacts?.length || 0;
  const unreadContacts = contacts?.filter(contact => !contact.isRead).length || 0;

  // Get occupation stats if available
  const occupationStats = registrations?.reduce((acc, curr) => {
    if (curr.occupation) {
      acc[curr.occupation] = (acc[curr.occupation] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Get most popular topics
  const topicStats = registrations?.reduce((acc, curr) => {
    if (curr.topics) {
      const topicList = curr.topics.split(',');
      topicList.forEach(topic => {
        acc[topic.trim()] = (acc[topic.trim()] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Ümumi Qeydiyyat</CardTitle>
          <CardDescription>Qeydiyyatdan keçənlərin sayı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{totalRegistrations}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Əlaqə Sorğuları</CardTitle>
          <CardDescription>Göndərilən sorğuların sayı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{totalContacts}</div>
          <div className="text-sm text-muted-foreground mt-2">
            {unreadContacts} oxunmamış mesaj
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Aktiv İstifadəçilər</CardTitle>
          <CardDescription>Son 24 saat ərzində qeydiyyat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {registrations?.filter(reg => {
              const date = new Date(reg.createdAt);
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - date.getTime());
              const diffDays = diffTime / (1000 * 60 * 60 * 24);
              return diffDays <= 1;
            }).length || 0}
          </div>
        </CardContent>
      </Card>

      {occupationStats && Object.keys(occupationStats).length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>İştirakçı Peşələri</CardTitle>
            <CardDescription>Qeydiyyatdan keçən iştirakçıların peşə bölgüsü</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(occupationStats).map(([occupation, count]) => (
                <Badge key={occupation} variant="outline" className="text-xs">
                  {occupation}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {topicStats && Object.keys(topicStats).length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Populyar Mövzular</CardTitle>
            <CardDescription>İştirakçıların seçdiyi mövzular</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(topicStats)
                .sort((a, b) => b[1] - a[1])
                .map(([topic, count]) => (
                  <Badge key={topic} variant="secondary" className="text-xs">
                    {topic}: {count}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Registrations panel
function RegistrationsPanel() {
  const { toast } = useToast();
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{start?: Date, end?: Date}>({});

  const { data: registrations, isLoading, refetch } = useQuery<Registration[]>({
    queryKey: ["/api/admin/registrations", refreshKey],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Filter registrations based on search term and date range
  const filteredRegistrations = registrations?.filter(registration => {
    // Filter by search term
    const searchTermMatch = 
      searchTerm.trim() === "" || 
      registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registration.occupation && registration.occupation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by date range
    let dateMatch = true;
    const regDate = new Date(registration.createdAt);
    
    if (dateRange.start) {
      dateMatch = dateMatch && regDate >= dateRange.start;
    }
    
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      dateMatch = dateMatch && regDate <= endDate;
    }
    
    return searchTermMatch && dateMatch;
  }) || [];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
    toast({
      title: "Yeniləndi",
      description: "Qeydiyyat siyahısı yeniləndi",
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Qeydiyyatı silmək mümkün olmadı');
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/registrations"] });
      toast({
        title: "Qeydiyyat silindi",
        description: "Qeydiyyat uğurla silindi",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message || "Qeydiyyatı silmək mümkün olmadı",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Download registrations as CSV
  const handleDownloadCSV = () => {
    try {
      setIsDownloading(true);
      
      // Create CSV header
      const csvHeader = "№,Ad,Soyad,Email,Telefon,Peşə,Mövzular,Tarix\n";
      
      // Create CSV rows
      const csvRows = filteredRegistrations.map((reg, index) => {
        return `${index + 1},"${reg.firstName}","${reg.lastName}","${reg.email}","${reg.phone}","${reg.occupation || ""}","${reg.topics || ""}","${formatDate(new Date(reg.createdAt))}"`;
      }).join("\n");
      
      // Combine header and rows
      const csvContent = csvHeader + csvRows;
      
      // Create download link and click it
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `TedxNDU_Qeydiyyatlar_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "CSV Endirildi",
        description: "Qeydiyyat siyahısı CSV formatında endirildi",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "CSV faylını endirmək mümkün olmadı",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setDateRange({});
    toast({
      title: "Filtrlər sıfırlandı",
      description: "Bütün filtrlər sıfırlandı",
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl font-bold">Qeydiyyatlar</h2>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <div className="relative">
            <Input
              placeholder="Axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[200px] pr-8"
            />
            {searchTerm && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Yenilə</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDownloadCSV}
                  disabled={isDownloading || (filteredRegistrations?.length || 0) === 0}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>CSV Endir</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            Filtrlər <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !registrations || registrations.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Hələ heç bir qeydiyyat yoxdur</p>
        </Card>
      ) : filteredRegistrations.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Axtarış meyarlarınıza uyğun qeydiyyat tapılmadı</p>
          <Button variant="link" onClick={clearFilters} className="mt-2">
            Filtrləri sıfırla
          </Button>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>№</TableHead>
                    <TableHead>Ad</TableHead>
                    <TableHead>Soyad</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Peşə</TableHead>
                    <TableHead>Tarix</TableHead>
                    <TableHead>Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration, index) => (
                    <TableRow key={registration.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{registration.firstName}</TableCell>
                      <TableCell>{registration.lastName}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.phone}</TableCell>
                      <TableCell>{registration.occupation || "-"}</TableCell>
                      <TableCell>{formatDate(new Date(registration.createdAt))}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedRegistration(registration);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Sil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Qeydiyyatı silmək istədiyinizə əminsiniz?</DialogTitle>
            <DialogDescription>
              Bu əməliyyat geri qaytarıla bilməz və bütün qeydiyyat məlumatları tamamilə silinəcək.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Ləğv et
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedRegistration && handleDelete(selectedRegistration.id)}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filtrləri Tənzimləyin</DialogTitle>
            <DialogDescription>
              Qeydiyyat məlumatlarını süzmək üçün filtrlər tətbiq edin
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Tarix aralığı</h4>
              <div className="flex flex-col space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm" htmlFor="start-date">Başlanğıc tarix</label>
                    <Input 
                      id="start-date"
                      type="date" 
                      value={dateRange.start?.toISOString().slice(0, 10) || ''}
                      onChange={(e) => setDateRange({
                        ...dateRange,
                        start: e.target.value ? new Date(e.target.value) : undefined
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm" htmlFor="end-date">Son tarix</label>
                    <Input 
                      id="end-date"
                      type="date" 
                      value={dateRange.end?.toISOString().slice(0, 10) || ''}
                      onChange={(e) => setDateRange({
                        ...dateRange,
                        end: e.target.value ? new Date(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={clearFilters}
            >
              Filtrləri sıfırla
            </Button>
            <Button
              onClick={() => setIsFilterDialogOpen(false)}
            >
              Tətbiq et
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Email schema for reply form
const replyFormSchema = z.object({
  to: z.string().email("Düzgün email ünvanı daxil edin"),
  subject: z.string().min(1, "Mövzu daxil edin"),
  message: z.string().min(1, "Mesaj daxil edin"),
});

// Speaker form schema
const speakerFormSchema = z.object({
  name: z.string().min(1, "Natiqin adı tələb olunur"),
  title: z.string().min(1, "Natiqin vəzifəsi tələb olunur"),
  bio: z.string().min(1, "Natiqin bioqrafiyası tələb olunur"),
  topic: z.string().min(1, "Natiqin mövzusu tələb olunur"),
  image: z.string().optional()
});

// Program session form schema
const sessionFormSchema = z.object({
  id: z.string().min(1, "ID tələb olunur"),
  name: z.string().min(1, "Sessiya adı tələb olunur")
});

// Program item form schema
const programItemFormSchema = z.object({
  time: z.string().min(1, "Vaxt tələb olunur"),
  title: z.string().min(1, "Başlıq tələb olunur"),
  description: z.string().optional(),
  speakerId: z.number().optional().nullable(),
  session: z.string().min(1, "Sessiya tələb olunur")
});

type ReplyFormValues = z.infer<typeof replyFormSchema>;
type SpeakerFormValues = z.infer<typeof speakerFormSchema>;
type SessionFormValues = z.infer<typeof sessionFormSchema>;
type ProgramItemFormValues = z.infer<typeof programItemFormSchema>;
type SponsorFormValues = z.infer<typeof sponsorFormSchema>;

// Speakers Panel Component
function SpeakersPanel() {
  const { toast } = useToast();
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSpeakerDialogOpen, setIsSpeakerDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: speakers, isLoading, refetch } = useQuery<Speaker[]>({
    queryKey: ["/api/admin/speakers", refreshKey],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Speaker form
  const speakerForm = useForm<SpeakerFormValues>({
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      topic: "",
      image: ""
    },
    resolver: zodResolver(speakerFormSchema)
  });
  
  // Filter speakers based on search term
  const filteredSpeakers = speakers?.filter(speaker => {
    return searchTerm.trim() === "" || 
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.topic.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];
  
  // Refresh speakers list
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
    toast({
      title: "Yeniləndi",
      description: "Natiqlər siyahısı yeniləndi",
    });
  };
  
  // Initialize speaker form for editing
  const initSpeakerForm = (speaker: Speaker | null = null) => {
    speakerForm.reset(speaker || {
      name: "",
      title: "",
      bio: "",
      topic: "",
      image: ""
    });
    setIsEditing(!!speaker);
    setSelectedSpeaker(speaker);
    setIsSpeakerDialogOpen(true);
  };
  
  // Handle speaker form submission
  const onSpeakerSubmit = async (data: SpeakerFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && selectedSpeaker) {
        // Update speaker
        const response = await fetch(`/api/admin/speakers/${selectedSpeaker.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Natiq məlumatlarını yeniləmək mümkün olmadı');
        }
        
        toast({
          title: "Natiq yeniləndi",
          description: "Natiq məlumatları uğurla yeniləndi",
        });
      } else {
        // Add new speaker
        const response = await fetch('/api/admin/speakers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Natiq əlavə etmək mümkün olmadı');
        }
        
        toast({
          title: "Natiq əlavə edildi",
          description: "Yeni natiq uğurla əlavə edildi",
        });
      }
      
      // Refresh speakers and close dialog
      queryClient.invalidateQueries({ queryKey: ["/api/admin/speakers"] });
      setIsSpeakerDialogOpen(false);
      speakerForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle speaker deletion
  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/speakers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Natiqi silmək mümkün olmadı');
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/speakers"] });
      toast({
        title: "Natiq silindi",
        description: "Natiq uğurla silindi",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message,
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl font-bold">Natiqlər</h2>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <div className="relative">
            <Input
              placeholder="Axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[200px] pr-8"
            />
            {searchTerm && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Yenilə</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            size="sm"
            onClick={() => initSpeakerForm()}
          >
            <Plus className="h-4 w-4 mr-1" /> Natiq əlavə et
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !speakers || speakers.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Hələ heç bir natiq əlavə edilməyib</p>
          <Button 
            variant="link" 
            onClick={() => initSpeakerForm()} 
            className="mt-2"
          >
            Natiq əlavə et
          </Button>
        </Card>
      ) : filteredSpeakers.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Axtarış meyarlarınıza uyğun natiq tapılmadı</p>
          <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2">
            Filtrləri sıfırla
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpeakers.map((speaker) => (
            <Card key={speaker.id} className="overflow-hidden">
              <div className="aspect-[3/2] relative">
                <img 
                  src={speaker.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&background=random`} 
                  alt={speaker.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardHeader>
                <CardTitle>{speaker.name}</CardTitle>
                <CardDescription>{speaker.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3">{speaker.bio}</p>
                <div className="mt-3">
                  <Badge variant="secondary">{speaker.topic}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSelectedSpeaker(speaker);
                    initSpeakerForm(speaker);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" /> Düzəliş et
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedSpeaker(speaker);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash className="h-4 w-4 mr-1" /> Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Speaker Form Dialog */}
      <Dialog open={isSpeakerDialogOpen} onOpenChange={setIsSpeakerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Natiq məlumatlarını düzəlt" : "Yeni natiq əlavə et"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...speakerForm}>
            <form onSubmit={speakerForm.handleSubmit(onSpeakerSubmit)} className="space-y-4">
              <FormField
                control={speakerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad</FormLabel>
                    <FormControl>
                      <Input placeholder="Natiqin adı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={speakerForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vəzifə</FormLabel>
                    <FormControl>
                      <Input placeholder="Natiqin vəzifəsi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={speakerForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bioqrafiya</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Natiq haqqında qısa məlumat" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={speakerForm.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mövzu</FormLabel>
                    <FormControl>
                      <Input placeholder="Natiqin çıxış mövzusu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={speakerForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şəkil URL (istəyə bağlı)</FormLabel>
                    <FormControl>
                      <Input placeholder="Şəkil URL ünvanı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsSpeakerDialogOpen(false);
                    speakerForm.reset();
                  }}
                  disabled={isSubmitting}
                >
                  Ləğv et
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Yenilə" : "Əlavə et"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Natiqi silmək istədiyinizə əminsiniz?</DialogTitle>
            <DialogDescription>
              Bu əməliyyat geri qaytarıla bilməz və natiq məlumatları tamamilə silinəcək.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Ləğv et
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedSpeaker && handleDelete(selectedSpeaker.id)}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Program Management Panel Component
function ProgramPanel() {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<"sessions" | "items">("sessions");
  const [refreshKey, setRefreshKey] = useState(0);
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl font-bold">Proqram Planlaşdırma</h2>
        
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <Button 
            variant={activeView === "sessions" ? "default" : "outline"} 
            onClick={() => setActiveView("sessions")}
          >
            Sessiyalar
          </Button>
          <Button 
            variant={activeView === "items" ? "default" : "outline"} 
            onClick={() => setActiveView("items")}
          >
            Proqram Elementləri
          </Button>
        </div>
      </div>
      
      {activeView === "sessions" ? (
        <SessionsPanel refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
      ) : (
        <ProgramItemsPanel refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
      )}
    </div>
  );
}

// Sponsors Panel Component

function SponsorsPanel() {
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch sponsors
  const { data: sponsors, isLoading } = useQuery<Sponsor[]>({
    queryKey: ["/api/admin/sponsors", refreshKey],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Filtered sponsors
  const filteredSponsors = sponsors?.filter(sponsor => 
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Form for adding/editing sponsor
  const form = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: {
      name: "",
      logo: "",
      website: "",
      level: "",
      order: 0,
    }
  });
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!isAddDialogOpen && !isEditDialogOpen) {
      form.reset();
    }
  }, [isAddDialogOpen, isEditDialogOpen, form]);
  
  // Set form values when editing
  useEffect(() => {
    if (selectedSponsor && isEditDialogOpen) {
      form.reset({
        name: selectedSponsor.name,
        logo: selectedSponsor.logo,
        website: selectedSponsor.website || "",
        level: selectedSponsor.level,
        order: selectedSponsor.order,
      });
    }
  }, [selectedSponsor, isEditDialogOpen, form]);
  
  // Handle form submission
  const onSubmit = async (values: SponsorFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditDialogOpen && selectedSponsor) {
        // Update sponsor
        const response = await fetch(`/api/admin/sponsors/${selectedSponsor.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        
        if (!response.ok) {
          throw new Error("Sponsoru yeniləmək mümkün olmadı");
        }
        
        toast({
          title: "Sponsor yeniləndi",
          description: "Sponsor məlumatları uğurla yeniləndi",
        });
        
        setIsEditDialogOpen(false);
        
      } else {
        // Add new sponsor
        const response = await fetch("/api/admin/sponsors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        
        if (!response.ok) {
          throw new Error("Sponsor əlavə etmək mümkün olmadı");
        }
        
        toast({
          title: "Sponsor əlavə edildi",
          description: "Yeni sponsor uğurla əlavə edildi",
        });
        
        setIsAddDialogOpen(false);
      }
      
      // Refresh data
      setRefreshKey((prev: number) => prev + 1);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!selectedSponsor) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/admin/sponsors/${selectedSponsor.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Sponsoru silmək mümkün olmadı");
      }
      
      toast({
        title: "Sponsor silindi",
        description: "Sponsor uğurla silindi",
      });
      
      setIsDeleteDialogOpen(false);
      setRefreshKey(prev => prev + 1);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to get level badge
  const getLevelBadge = (level: string) => {
    switch (level) {
      case "platinum":
        return <Badge className="bg-zinc-300 text-black hover:bg-zinc-300">Platinum</Badge>;
      case "gold":
        return <Badge className="bg-yellow-500 text-black hover:bg-yellow-500">Qızıl</Badge>;
      case "silver":
        return <Badge className="bg-gray-400 text-black hover:bg-gray-400">Gümüş</Badge>;
      case "bronze":
        return <Badge className="bg-amber-600 text-white hover:bg-amber-600">Bürünc</Badge>;
      case "partner":
        return <Badge className="bg-blue-500 hover:bg-blue-500">Tərəfdaş</Badge>;
      case "media":
        return <Badge className="bg-purple-500 hover:bg-purple-500">Media</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };
  
  // Refresh data
  const handleRefresh = () => {
    setRefreshKey(incrementState);
    toast({
      title: "Yeniləndi",
      description: "Sponsorlar siyahısı yeniləndi",
    });
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold">Sponsorlar</h2>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <div className="relative">
            <Input
              placeholder="Axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[200px] pr-8"
            />
            {searchTerm && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Yenilə</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Sponsor əlavə et
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sponsors?.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted/30">
          <Award className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-1">Sponsor tapılmadı</h3>
          <p className="text-muted-foreground mb-4">Hələ heç bir sponsor əlavə edilməyib</p>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
            İlk sponsor əlavə et
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Ad</TableHead>
              <TableHead>Səviyyə</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead>Tarix</TableHead>
              <TableHead className="text-right">Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSponsors?.map((sponsor, index) => (
              <TableRow key={sponsor.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="w-16 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    <img 
                      src={sponsor.logo} 
                      alt={sponsor.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{sponsor.name}</div>
                  {sponsor.website && (
                    <a 
                      href={sponsor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground flex items-center hover:text-primary"
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      {new URL(sponsor.website).hostname}
                    </a>
                  )}
                </TableCell>
                <TableCell>{getLevelBadge(sponsor.level)}</TableCell>
                <TableCell>{sponsor.order}</TableCell>
                <TableCell>{formatDate(new Date(sponsor.createdAt))}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedSponsor(sponsor);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Düzəliş et</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setSelectedSponsor(sponsor);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sil</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          if (isAddDialogOpen) setIsAddDialogOpen(false);
          if (isEditDialogOpen) setIsEditDialogOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? 'Yeni sponsor əlavə et' : 'Sponsoru düzəliş et'}
            </DialogTitle>
            <DialogDescription>
              {isAddDialogOpen 
                ? 'Tədbirin sponsorunu əlavə etmək üçün aşağıdakı məlumatları doldurun' 
                : 'Sponsor məlumatlarını düzəliş etmək üçün aşağıdakı sahələri yeniləyin'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsor adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Şirkət adı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Logo şəklinin URL-i" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vebsayt (istəyə bağlı)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsorluq səviyyəsi</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sponsorluq səviyyəsini seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="platinum">Platinum</SelectItem>
                        <SelectItem value="gold">Qızıl</SelectItem>
                        <SelectItem value="silver">Gümüş</SelectItem>
                        <SelectItem value="bronze">Bürünc</SelectItem>
                        <SelectItem value="partner">Tərəfdaş</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sıra nömrəsi</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    if (isAddDialogOpen) setIsAddDialogOpen(false);
                    if (isEditDialogOpen) setIsEditDialogOpen(false);
                  }}
                >
                  Ləğv et
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isAddDialogOpen ? 'Əlavə et' : 'Yadda saxla'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sponsoru silmək istədiyinizə əminsiniz?</DialogTitle>
            <DialogDescription>
              Bu əməliyyat geri qaytarıla bilməz. Bu sponsor silinəcək.
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md p-3 flex items-center gap-3">
            {selectedSponsor && (
              <>
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={selectedSponsor.logo} 
                    alt={selectedSponsor.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{selectedSponsor.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {getLevelBadge(selectedSponsor.level)}
                  </p>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Ləğv et
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sessions Panel Subcomponent
function SessionsPanel({ refreshKey, setRefreshKey }: { refreshKey: number, setRefreshKey: (key: number) => void }) {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<ProgramSession | null>(null);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: sessions, isLoading } = useQuery<ProgramSession[]>({
    queryKey: ["/api/admin/program/sessions", refreshKey],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Session form
  const sessionForm = useForm<SessionFormValues>({
    defaultValues: {
      id: "",
      name: ""
    },
    resolver: zodResolver(sessionFormSchema)
  });
  
  // Initialize session form for editing
  const initSessionForm = (session: ProgramSession | null = null) => {
    sessionForm.reset(session || {
      id: "",
      name: ""
    });
    setIsEditing(!!session);
    setSelectedSession(session);
    setIsSessionDialogOpen(true);
  };
  
  // Handle session form submission
  const onSessionSubmit = async (data: SessionFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && selectedSession) {
        // Update session
        const response = await fetch(`/api/admin/program/sessions/${selectedSession.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Sessiya məlumatlarını yeniləmək mümkün olmadı');
        }
        
        toast({
          title: "Sessiya yeniləndi",
          description: "Sessiya məlumatları uğurla yeniləndi",
        });
      } else {
        // Add new session
        const response = await fetch('/api/admin/program/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Sessiya əlavə etmək mümkün olmadı');
        }
        
        toast({
          title: "Sessiya əlavə edildi",
          description: "Yeni sessiya uğurla əlavə edildi",
        });
      }
      
      // Refresh sessions and close dialog
      queryClient.invalidateQueries({ queryKey: ["/api/admin/program/sessions"] });
      setIsSessionDialogOpen(false);
      sessionForm.reset();
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle session deletion
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/program/sessions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Sessiyanı silmək mümkün olmadı');
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/program/sessions"] });
      toast({
        title: "Sessiya silindi",
        description: "Sessiya uğurla silindi",
      });
      setIsDeleteDialogOpen(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message,
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={() => initSessionForm()}
        >
          <Plus className="h-4 w-4 mr-1" /> Sessiya əlavə et
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Hələ heç bir sessiya əlavə edilməyib</p>
          <Button 
            variant="link" 
            onClick={() => initSessionForm()} 
            className="mt-2"
          >
            Sessiya əlavə et
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <CardTitle>{session.name}</CardTitle>
                <CardDescription>ID: {session.id}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => initSessionForm(session)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Düzəliş et
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedSession(session);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash className="h-4 w-4 mr-1" /> Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Session Form Dialog */}
      <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Sessiya məlumatlarını düzəlt" : "Yeni sessiya əlavə et"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...sessionForm}>
            <form onSubmit={sessionForm.handleSubmit(onSessionSubmit)} className="space-y-4">
              <FormField
                control={sessionForm.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Sessiya ID (məs: morning, afternoon)" 
                        {...field} 
                        disabled={isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={sessionForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad</FormLabel>
                    <FormControl>
                      <Input placeholder="Sessiya adı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsSessionDialogOpen(false);
                    sessionForm.reset();
                  }}
                  disabled={isSubmitting}
                >
                  Ləğv et
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Yenilə" : "Əlavə et"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sessiyanı silmək istədiyinizə əminsiniz?</DialogTitle>
            <DialogDescription>
              Bu əməliyyat geri qaytarıla bilməz və sessiya ilə əlaqəli proqram elementləri təsirlənə bilər.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Ləğv et
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedSession && handleDelete(selectedSession.id)}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Program Items Panel Subcomponent
function ProgramItemsPanel({ refreshKey, setRefreshKey }: { refreshKey: number, setRefreshKey: (key: number) => void }) {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<ProgramItem | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSession, setActiveSession] = useState<string | null>(null);
  
  const { data: items, isLoading: itemsLoading } = useQuery<ProgramItem[]>({
    queryKey: ["/api/admin/program/items", refreshKey],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  const { data: sessions, isLoading: sessionsLoading } = useQuery<ProgramSession[]>({
    queryKey: ["/api/admin/program/sessions", refreshKey],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  const { data: speakers, isLoading: speakersLoading } = useQuery<Speaker[]>({
    queryKey: ["/api/admin/speakers", refreshKey],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Program item form
  const itemForm = useForm<ProgramItemFormValues>({
    defaultValues: {
      time: "",
      title: "",
      description: "",
      speakerId: null,
      session: "morning" // Ensure a valid default session is always provided
    },
    resolver: zodResolver(programItemFormSchema)
  });
  
  // Filter program items based on search term and active session
  const filteredItems = items?.filter(item => {
    const searchMatch = searchTerm.trim() === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const sessionMatch = !activeSession || item.session === activeSession;
    
    return searchMatch && sessionMatch;
  }) || [];
  
  // Initialize program item form for editing
  const initItemForm = (item: ProgramItem | null = null) => {
    itemForm.reset(item ? {
      ...item,
      speakerId: item.speakerId || null
    } : {
      time: "",
      title: "",
      description: "",
      speakerId: null,
      session: activeSession || "morning" // Default to morning session if none is active
    });
    setIsEditing(!!item);
    setSelectedItem(item);
    setIsItemDialogOpen(true);
  };
  
  // Handle program item form submission
  const onItemSubmit = async (data: ProgramItemFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && selectedItem) {
        // Update program item
        const response = await fetch(`/api/admin/program/items/${selectedItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Proqram elementini yeniləmək mümkün olmadı');
        }
        
        toast({
          title: "Proqram elementi yeniləndi",
          description: "Proqram elementi uğurla yeniləndi",
        });
      } else {
        // Add new program item
        const response = await fetch('/api/admin/program/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Proqram elementi əlavə etmək mümkün olmadı');
        }
        
        toast({
          title: "Proqram elementi əlavə edildi",
          description: "Yeni proqram elementi uğurla əlavə edildi",
        });
      }
      
      // Refresh program items and close dialog
      queryClient.invalidateQueries({ queryKey: ["/api/admin/program/items"] });
      setIsItemDialogOpen(false);
      itemForm.reset();
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle program item deletion
  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/program/items/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Proqram elementini silmək mümkün olmadı');
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/program/items"] });
      toast({
        title: "Proqram elementi silindi",
        description: "Proqram elementi uğurla silindi",
      });
      setIsDeleteDialogOpen(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message,
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const isLoading = itemsLoading || sessionsLoading || speakersLoading;
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="relative w-full sm:w-[200px] mb-2 sm:mb-0">
          <Input
            placeholder="Axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-8"
          />
          {searchTerm && (
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={!activeSession ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveSession(null)}
          >
            Bütün sessiyalar
          </Button>
          
          {sessions?.map(session => (
            <Button 
              key={session.id} 
              variant={activeSession === session.id ? "default" : "outline"} 
              size="sm" 
              onClick={() => setActiveSession(session.id)}
            >
              {session.name}
            </Button>
          ))}
          
          <Button 
            onClick={() => initItemForm()}
            className="ml-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Yeni element
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !items || items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Hələ heç bir proqram elementi əlavə edilməyib</p>
          <Button 
            variant="link" 
            onClick={() => initItemForm()} 
            className="mt-2"
          >
            Proqram elementi əlavə et
          </Button>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Axtarış meyarlarınıza uyğun proqram elementi tapılmadı</p>
          <Button variant="link" onClick={() => {
            setSearchTerm("");
            setActiveSession(null);
          }} className="mt-2">
            Filtrləri sıfırla
          </Button>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vaxt</TableHead>
              <TableHead>Başlıq</TableHead>
              <TableHead>Təsvir</TableHead>
              <TableHead>Natiq</TableHead>
              <TableHead>Sessiya</TableHead>
              <TableHead>Əməliyyatlar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => {
              const session = sessions?.find(s => s.id === item.session);
              const speaker = speakers?.find(s => s.id === item.speakerId);
              
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.description || "-"}
                  </TableCell>
                  <TableCell>
                    {speaker ? speaker.name : "-"}
                  </TableCell>
                  <TableCell>
                    {session ? session.name : item.session}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => initItemForm(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      
      {/* Program Item Form Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Proqram elementini düzəlt" : "Yeni proqram elementi əlavə et"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(onItemSubmit)} className="space-y-4">
              <FormField
                control={itemForm.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vaxt</FormLabel>
                    <FormControl>
                      <Input placeholder="Məs: 09:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlıq</FormLabel>
                    <FormControl>
                      <Input placeholder="Proqram elementinin başlığı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Təsvir (istəyə bağlı)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Proqram elementinin təsviri" 
                        className="min-h-[80px]"
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="speakerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Natiq (istəyə bağlı)</FormLabel>
                    <Select
                      value={field.value?.toString() || "none"}
                      onValueChange={(value) => field.onChange(value !== "none" ? parseInt(value) : null)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Natiq seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Natiq yoxdur</SelectItem>
                        {speakers?.map((speaker) => (
                          <SelectItem key={speaker.id} value={speaker.id.toString()}>
                            {speaker.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="session"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sessiya</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sessiya seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sessions?.map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            {session.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsItemDialogOpen(false);
                    itemForm.reset();
                  }}
                  disabled={isSubmitting}
                >
                  Ləğv et
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Yenilə" : "Əlavə et"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Proqram elementini silmək istədiyinizə əminsiniz?</DialogTitle>
            <DialogDescription>
              Bu əməliyyat geri qaytarıla bilməz və proqram elementi tamamilə silinəcək.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Ləğv et
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedItem && handleDelete(selectedItem.id)}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Contacts panel component
function ContactsPanel() {
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSendingReply, setIsSendingReply] = useState(false);
  
  // Filter state
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const replyForm = useForm<ReplyFormValues>({
    defaultValues: {
      to: "",
      subject: "",
      message: ""
    },
    resolver: zodResolver(replyFormSchema)
  });

  const { data: contacts, isLoading, refetch } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts", refreshKey],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Filter contacts based on search terms and unread flag
  const filteredContacts = contacts?.filter(contact => {
    const searchMatch = 
      searchTerm.trim() === "" || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
      
    const readStatusMatch = !showUnreadOnly || !contact.isRead;
    
    return searchMatch && readStatusMatch;
  }) || [];

  // Mark as read when viewing a contact
  useEffect(() => {
    if (isViewDialogOpen && selectedContact && !selectedContact.isRead) {
      handleMarkAsRead(selectedContact.id);
    }
  }, [isViewDialogOpen, selectedContact]);

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Əlaqə mesajını silmək mümkün olmadı');
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      toast({
        title: "Əlaqə mesajı silindi",
        description: "Əlaqə mesajı uğurla silindi",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message || "Əlaqə mesajını silmək mümkün olmadı",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      setIsMarkingAsRead(true);
      const response = await fetch(`/api/admin/contacts/${id}/read`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Əlaqə mesajını oxunmuş kimi qeyd etmək mümkün olmadı');
      }

      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      
      // Update the selected contact if it's the one being marked as read
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({
          ...selectedContact,
          isRead: true
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: (error as Error).message || "Əlaqə mesajını oxunmuş kimi qeyd etmək mümkün olmadı",
      });
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  // Handle reply form submission
  const onReplySubmit = async (data: ReplyFormValues) => {
    try {
      setIsSendingReply(true);
      
      // In a real application, we would send the email via the server
      // For now, we'll just simulate it and open the default mail client
      window.location.href = `mailto:${data.to}?subject=${data.subject}&body=${data.message}`;
      
      // Mark the message as read if it isn't already
      if (selectedContact && !selectedContact.isRead) {
        await handleMarkAsRead(selectedContact.id);
      }
      
      toast({
        title: "Cavab hazırlandı",
        description: "Email müştərinizlə hazırlandı"
      });
      
      setIsReplyDialogOpen(false);
      replyForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta",
        description: "Cavab göndərmək mümkün olmadı"
      });
    } finally {
      setIsSendingReply(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
    toast({
      title: "Yeniləndi",
      description: "Əlaqə mesajları siyahısı yeniləndi",
    });
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setShowUnreadOnly(false);
    toast({
      title: "Filtrlər sıfırlandı",
      description: "Bütün filtrlər sıfırlandı",
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-2xl font-bold">Əlaqə Mesajları</h2>
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <div className="relative">
            <Input
              placeholder="Axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[200px] pr-8"
            />
            {searchTerm && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Yenilə</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Filtrlər <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => setShowUnreadOnly(!showUnreadOnly)}>
                <Checkbox 
                  checked={showUnreadOnly} 
                  className="mr-2" 
                  id="unread-only"
                />
                <label htmlFor="unread-only">Yalnız oxunmamışlar</label>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearFilters}>
                Filtrləri sıfırla
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !contacts || contacts.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Hələ heç bir əlaqə mesajı yoxdur</p>
        </Card>
      ) : filteredContacts.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Axtarış meyarlarınıza uyğun əlaqə mesajı tapılmadı</p>
          <Button variant="link" onClick={clearFilters} className="mt-2">
            Filtrləri sıfırla
          </Button>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>№</TableHead>
                    <TableHead>Ad</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mövzu</TableHead>
                    <TableHead>Tarix</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Əməliyyatlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact, index) => (
                    <TableRow 
                      key={contact.id} 
                      className={contact.isRead ? "" : "bg-primary/5"}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.subject}</TableCell>
                      <TableCell>{formatDate(new Date(contact.createdAt))}</TableCell>
                      <TableCell>
                        {contact.isRead ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            <Check className="h-3 w-3 mr-1" /> Oxunub
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                            <Mail className="h-3 w-3 mr-1" /> Yeni
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedContact(contact);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            Bax
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedContact(contact);
                              replyForm.reset({
                                to: contact.email,
                                subject: `RE: ${contact.subject}`,
                                message: ""
                              });
                              setIsReplyDialogOpen(true);
                            }}
                          >
                            Cavabla
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedContact(contact);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Əlaqə Mesajı</DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Göndərən</h4>
                  <p>{selectedContact.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Email</h4>
                  <p>{selectedContact.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Tarix</h4>
                  <p>{formatDate(new Date(selectedContact.createdAt))}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <p>
                    {selectedContact.isRead ? (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        <Check className="h-3 w-3 mr-1" /> Oxunub
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        <Mail className="h-3 w-3 mr-1" /> Yeni
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Mövzu</h4>
                <p className="font-medium text-lg">{selectedContact.subject}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Mesaj</h4>
                <ScrollArea className="h-[200px] border rounded-md p-4">
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </ScrollArea>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Bağla
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    replyForm.reset({
                      to: selectedContact.email,
                      subject: `RE: ${selectedContact.subject}`,
                      message: ""
                    });
                    setIsReplyDialogOpen(true);
                  }}
                >
                  Cavabla
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Mesaja Cavab</DialogTitle>
            <DialogDescription>
              Bu forma vasitəsilə əlaqə sorğusuna email cavab hazırlayın
            </DialogDescription>
          </DialogHeader>
          
          <Form {...replyForm}>
            <form onSubmit={replyForm.handleSubmit(onReplySubmit)} className="space-y-4">
              <FormField
                control={replyForm.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kimə</FormLabel>
                    <FormControl>
                      <Input placeholder="Email ünvanı" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={replyForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mövzu</FormLabel>
                    <FormControl>
                      <Input placeholder="Email mövzusu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={replyForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mesaj</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Cavab mesajı" 
                        className="h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsReplyDialogOpen(false)}
                >
                  Ləğv et
                </Button>
                <Button type="submit" disabled={isSendingReply}>
                  {isSendingReply && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cavab Göndər
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mesajı silmək istədiyinizə əminsiniz?</DialogTitle>
            <DialogDescription>
              Bu əməliyyat geri qaytarıla bilməz və əlaqə mesajı tamamilə silinəcək.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Ləğv et
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedContact && handleDelete(selectedContact.id)}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main Admin Page Component
export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // If not authenticated, redirect to auth page
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/auth";
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.username}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  fetch("/api/logout", {
                    method: "POST",
                  }).then(() => {
                    window.location.href = "/";
                  });
                }}
              >
                Çıxış
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Əsas Statistika</TabsTrigger>
            <TabsTrigger value="registrations">Qeydiyyatlar</TabsTrigger>
            <TabsTrigger value="contacts">Əlaqə Mesajları</TabsTrigger>
            <TabsTrigger value="speakers">Natiqlər</TabsTrigger>
            <TabsTrigger value="program">Proqram</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsorlar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <StatsPanel />
          </TabsContent>

          <TabsContent value="registrations">
            <RegistrationsPanel />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsPanel />
          </TabsContent>
          
          <TabsContent value="speakers">
            <SpeakersPanel />
          </TabsContent>
          
          <TabsContent value="program">
            <ProgramPanel />
          </TabsContent>
          
          <TabsContent value="sponsors">
            <SponsorsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}