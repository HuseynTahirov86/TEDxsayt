import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Loader2, Mail, Trash, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const { data: registrations, isLoading } = useQuery<Registration[]>({
    queryKey: ["/api/admin/registrations"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Qeydiyyatlar</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !registrations || registrations.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Hələ heç bir qeydiyyat yoxdur</p>
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
                  {registrations.map((registration, index) => (
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedRegistration(registration);
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

// Contacts panel
function ContactsPanel() {
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);

  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Əlaqə Mesajları</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !contacts || contacts.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Hələ heç bir əlaqə mesajı yoxdur</p>
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
                  {contacts.map((contact, index) => (
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
        </Tabs>
      </main>
    </div>
  );
}