"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Upload, Clock } from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  subjects: string[];
  expertise: string[];
  photo: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor;
  onBookingComplete: (booking: any) => void;
}

export function BookingModal({
  isOpen,
  onClose,
  mentor,
  onBookingComplete,
}: BookingModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate time slots for 2-hour blocks
  const timeSlots = [
    "09:00 - 11:00",
    "11:00 - 13:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const booking = {
      id: Date.now().toString(),
      mentorId: mentor.id,
      mentorName: mentor.name,
      date,
      time,
      paymentSlip: paymentSlip?.name || "No file uploaded",
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    onBookingComplete(booking);
    setIsSubmitting(false);
    onClose();
    
    // Reset form
    setDate("");
    setTime("");
    setPaymentSlip(null);
    setNotes("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentSlip(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Session with {mentor.name}</DialogTitle>
          <DialogDescription>
            Schedule a 2-hour session with {mentor.name}. Please select your preferred date and time, then upload your payment slip.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time Slot (2 hours)</Label>
            <Select value={time} onValueChange={setTime} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {slot}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-slip">Payment Slip</Label>
            <div className="relative">
              <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="payment-slip"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Upload a screenshot or PDF of your payment confirmation
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific topics you'd like to cover or questions you have..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 