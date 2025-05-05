import { useEffect, useState, useRef } from "react";
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
  Calendar,
  Edit,
  Plus,
  Upload,
  Mic,
  Users,
  ListChecks,
  Database 
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
                  {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>CSV olaraq endir</p>
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
                      <TableCell>
                        {registration.firstName} {registration.lastName}
                      </TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.phone}</TableCell>
                      <TableCell>{registration.occupation || "-"}</TableCell>
                      <TableCell>{formatDate(new Date(registration.createdAt))}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRegistration(registration);
                                    // Show details in a modal - to be implemented
                                  }}
                                >
                                  <Eye className="h-4 w-4 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ətraflı bax</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRegistration(registration);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
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
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between py-2 px-4 border-t">
            <div className="text-sm text-muted-foreground">
              Cəmi: <span className="font-medium">{registrations.length}</span> qeydiyyat
              {filteredRegistrations.length !== registrations.length && 
                ` (${filteredRegistrations.length} göstərilir)`
              }
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qeydiyyatı silmək istədiyinizə əminsiniz?</DialogTitle>
            <DialogDescription>
              {selectedRegistration && (
                <p>
                  {selectedRegistration.firstName} {selectedRegistration.lastName} ({selectedRegistration.email}) 
                  qeydiyyatı silinəcək. Bu əməliyyat geri qaytarıla bilməz.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Ləğv et
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedRegistration && handleDelete(selectedRegistration.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Silinir...
                </>
              ) : (
                "Sil"
              )}
            </Button>
          </div>
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

// Contacts panel
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
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedContact?.subject}</DialogTitle>
            <DialogDescription>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Göndərən: {selectedContact?.name} ({selectedContact?.email})</span>
                <span>{selectedContact && formatDate(new Date(selectedContact.createdAt))}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="mt-2 max-h-[300px] overflow-y-auto">
            <p className="whitespace-pre-wrap">{selectedContact?.message}</p>
          </div>
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                // Add mailto link
                if (selectedContact) {
                  window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`;
                }
              }}
            >
              <Mail className="h-4 w-4 mr-2" /> Cavab ver
            </Button>
            <Button 
              variant="default" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Bağla
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Əlaqə mesajını silmək istədiyinizə əminsiniz?</DialogTitle>
            <DialogDescription>
              {selectedContact && (
                <p>
                  {selectedContact.name} ({selectedContact.email}) tərəfindən göndərilən əlaqə mesajı silinəcək. 
                  Bu əməliyyat geri qaytarıla bilməz.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Ləğv et
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedContact && handleDelete(selectedContact.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Silinir...
                </>
              ) : (
                "Sil"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main Admin Page component
export default function AdminPage() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">TEDx NDU Admin Panel</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-gray-600">
                Xoş gəlmisiniz, <span className="font-semibold">{user.username}</span>
              </span>
            )}
            <Button variant="outline" onClick={handleLogout} disabled={logoutMutation.isPending}>
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Çıxış...
                </>
              ) : (
                "Çıxış"
              )}
            </Button>
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
        </Tabs>
      </main>
    </div>
  );
}