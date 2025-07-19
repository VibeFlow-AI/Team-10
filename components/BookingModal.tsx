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
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/lib/auth";
import { studentService } from "@/lib/services/studentService";

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
  const { user } = useAuth();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    setError(null);
    try {
      if (!user) throw new Error("You must be logged in to book a session.");
      if (!date || !time) throw new Error("Date and time are required.");
      // Use a mock slip URL instead of uploading the real image
      const slipUrl = "/public/mock-slip.png";
      // Combine date and time into a DateTime string (use start time)
      const [startTime] = time.split(" - ");
      const dateTime = `${date}T${startTime}:00`;
      // Call backend booking logic
      await studentService.bookMentorSession(user.uid, mentor.id, dateTime, slipUrl);
      // Call onBookingComplete for UI update
      const booking = {
        id: Date.now().toString(),
        mentorId: mentor.id,
        mentorName: mentor.name,
        date,
        time,
        paymentSlip: slipUrl,
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
      setPreviewUrl(null);
    } catch (err: any) {
      setError(err.message || "Booking failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentSlip(file);
      setPreviewUrl(URL.createObjectURL(file));
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
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="mt-2 max-h-32 mx-auto rounded shadow" />
            )}
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

          {error && <div className="text-red-600 text-center">{error}</div>}

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