"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, DollarSign } from "lucide-react";
import { Mentor } from "@/lib/mentor-data";

interface MentorCardProps {
  mentor: Mentor;
  onBookNow: (mentor: Mentor) => void;
}

export function MentorCard({ mentor, onBookNow }: MentorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <img
            src={mentor.photo}
            alt={mentor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {mentor.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{mentor.rating}</span>
              </div>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{mentor.experience}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Subjects</h4>
          <div className="flex flex-wrap gap-1">
            {mentor.subjects.map((subject) => (
              <Badge key={subject} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Expertise</h4>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {mentor.expertise.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.expertise.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>2 hours</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>${mentor.hourlyRate}/hr</span>
            </div>
          </div>
          <Button 
            onClick={() => onBookNow(mentor)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 