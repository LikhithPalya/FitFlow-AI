'use client';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {adaptWorkoutPlan} from '@/ai/flows/adapt-workout-plan';
import {generateWorkoutPlan} from '@/ai/flows/generate-workout-plan';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useRef, useState} from 'react';
import {toast} from 'react-hot-toast';
import {cn} from '@/lib/utils';
import {Loader2} from 'lucide-react';
import Link from 'next/link';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';

const formSchema = z.object({
  age: z.string().min(1, {
    message: 'Age is required.',
  }),
  weight: z.string().min(1, {
    message: 'Weight is required.',
  }),
  fitnessGoals: z.string().min(10, {
    message: 'Fitness goals must be at least 10 characters.',
  }),
  availableEquipment: z.string().min(10, {
    message: 'Available equipment must be at least 10 characters.',
  }),
  workoutPlan: z.string().optional(),
  feedback: z.string().optional(),
  adaptedWorkoutPlan: z.string().optional(),
  explanation: z.string().optional(),
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="bg-gray-900 p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            FitFlow AI
          </Link>
          <div className="flex space-x-4">
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
          </div>
        </nav>
      </header>
      <main className="p-4 md:p-8 flex-grow">
        <Card className="w-full max-w-4xl mx-auto my-8 bg-gray-800 text-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">About Likhith Palya</CardTitle>
            <CardDescription className="text-gray-400">
              My love language is 200, OK?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src="https://picsum.photos/200/200" alt="Likhith Palya" />
              <AvatarFallback>LP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg">
                I'm Likhith Palya, a third-year engineering student at UVCE,
                Bengaluru, with a strong passion for software development and
                problem-solving. My foundation in Data Structures and Algorithms
                is complemented by hands-on experience in full-stack web
                development using JavaScript and related technologies. I’ve
                built several projects, including a collaborative online code
                editor and dynamic web apps. My tech journey began as a Business
                Development intern at Phyllo, where I honed my communication and
                teamwork skills. Currently, as the SAP Campus Champion at UVCE, I
                lead initiatives to foster innovation, combining technical
                expertise with leadership to build scalable, impactful,
                community-driven platforms.
              </p>
              <p className="text-gray-400 mt-2">
                Contact me at: <a href="mailto:likhithpalya@gmail.com" className="hover:underline">likhithpalya@gmail.com</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-gray-900 text-gray-400 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} FitFlow AI. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="mailto:likhithpalya@gmail.com" className="hover:text-gray-300">likhithpalya@gmail.com</a>
            <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </footer>
      <Toaster/>
    </div>
  );
}
import { Toaster } from 'react-hot-toast';
