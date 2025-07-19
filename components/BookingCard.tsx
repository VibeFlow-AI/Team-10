"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, User } from "lucide-react";

interface Booking {
  id: string;
  mentorId: string;
  mentorName: string;
  date: string;
  time: string;
  paymentSlip: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Session with {booking.mentorName}
            </CardTitle>
            <CardDescription className="mt-1">
              {formatDate(booking.date)}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{booking.date}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{booking.time}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>Payment: {booking.paymentSlip}</span>
        </div>
        
        {booking.notes && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <strong>Notes:</strong> {booking.notes}
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Booked on: {formatDate(booking.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
} 