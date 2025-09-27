import React from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Mail } from "lucide-react";
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactUsTableProps {
  contacts: ContactMessage[];
}

const ContactUsTable: React.FC<ContactUsTableProps> = ({ contacts }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
              <Mail className="h-7 w-7 text-yellow-600" />
             Contact Messages
            </CardTitle>

            <CardDescription className="text-gray-600 mt-1">
              All customer inquiries from the contact form
            </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
                <TableHead className="text-white font-semibold">No</TableHead>
                <TableHead className="text-white font-semibold">Name</TableHead>
                <TableHead className="text-white font-semibold">Email</TableHead>
                <TableHead className="text-white font-semibold">Phone</TableHead>
                <TableHead className="text-white font-semibold">Subject</TableHead>
                <TableHead className="text-white font-semibold">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No contact messages found.
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact,index) => (
                  <TableRow key={contact.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {contact.name}
                        </span>
                      </div></TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{contact.message}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactUsTable;
