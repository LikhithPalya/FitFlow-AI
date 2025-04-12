'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="bg-gray-900 p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            FitFlow AI
          </Link>
          <div className="flex space-x-4">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </div>
        </nav>
      </header>
      <main className="p-4 md:p-8 flex-grow">
        <Card className="w-full max-w-4xl mx-auto my-8 bg-gray-800 text-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">About the developer - Likhith Palya</CardTitle>
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
           <a href="/" className="hover:text-gray-300">Home</a>
            <a href="mailto:likhithpalya@gmail.com" className="hover:text-gray-300">likhithpalya@gmail.com</a>
             <a href="/about" className="hover:text-gray-300">About</a>
            <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

