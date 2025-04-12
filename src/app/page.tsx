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
import {useToast} from "@/hooks/use-toast"

import {ArrowUpCircle} from 'lucide-react';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const {toast} = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: '',
      weight: '',
      fitnessGoals: '',
      availableEquipment: '',
    },
  });

  const generatedWorkoutPlanRef = useRef<HTMLDivElement>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const workoutPlanOutput = await generateWorkoutPlan({
        age: parseInt(values.age),
        weight: parseInt(values.weight),
        fitnessGoals: values.fitnessGoals,
        availableEquipment: values.availableEquipment,
      });
      form.setValue('workoutPlan', workoutPlanOutput.workoutPlan);
      toast({
        title: "Workout Plan Generated!",
        description: "Your personalized workout plan is ready.",
      })
      // Scroll to the generated workout plan section after generation
      if (generatedWorkoutPlanRef.current) {
        generatedWorkoutPlanRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error('Error generating workout plan:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an error generating your workout plan. Please try again.",
      })
    } finally {
      setIsGenerating(false);
    }
  }

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
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Personalized Workout Plan Generator
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="age"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter your age"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter your weight in kg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fitnessGoals"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Fitness Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe your fitness goals"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableEquipment"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Available Equipment</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="List the equipment you have available"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    Generating Workout Plan...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  'Generate Workout Plan'
                )}
              </Button>
            </form>
          </Form>
          {form.watch('workoutPlan') && (
            <div
              ref={generatedWorkoutPlanRef}
              className="mt-10 p-6 bg-gray-700 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold mb-4 text-center">
                Generated Workout Plan
              </h2>
              <div>
                <p className="text-white text-lg">
                  Okay, here's a 20-day bodyweight workout plan designed to get
                  you fitter, focusing on consistency and progression. Remember
                  to consult your doctor before starting any new workout program.
                  This plan assumes you have no equipment available.
                </p>
                <h3 className="text-xl font-semibold mt-4">
                  Important Considerations:
                </h3>
                <ul className="list-disc pl-5">
                  <li>
                    <strong>Warm-up (5-10 minutes before each workout):</strong>{' '}
                    Dynamic stretching like arm circles, leg swings, torso
                    twists, and high knees.
                  </li>
                  <li>
                    <strong>Cool-down (5-10 minutes after each workout):</strong>{' '}
                    Static stretching, holding each stretch for 30 seconds
                    (e.g., hamstring stretch, quad stretch, calf stretch,
                    tricep stretch).
                  </li>
                  <li>
                    <strong>Rest:</strong> Take rest days when needed. Listen to
                    your body. It's better to rest than to push through pain
                    and risk injury.
                  </li>
                  <li>
                    <strong>Hydration:</strong> Drink plenty of water throughout
                    the day, especially before, during, and after workouts.
                  </li>
                  <li>
                    <strong>Nutrition:</strong> This is crucial for fitness. Focus
                    on a balanced diet with plenty of protein, fruits,
                    vegetables, and whole grains.
                  </li>
                  <li>
                    <strong>Progression:</strong> As exercises become easier,
                    increase the repetitions, sets, or difficulty (e.g., try a
                    harder variation of the exercise).
                  </li>
                </ul>
                <h3 className="text-xl font-semibold mt-4">
                  Workout Schedule (Repeat this 5-day cycle four times within 20
                  days, adjusting reps/sets as needed):
                </h3>
                <ul className="list-disc pl-5">
                  <li>
                    <strong>Day 1: Full Body Strength</strong>
                    <ul className="list-inside list-disc pl-5">
                      <li>
                        Squats:{' '}
                        <a
                          href="https://www.nerdfitness.com/blog/a-beginners-guide-to-squats-squat-types-modifications-and-more/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 12-15 reps
                        </a>
                      </li>
                      <li>
                        Push-ups (modify on knees if needed):{' '}
                        <a
                          href="https://www.healthline.com/fitness/push-ups-benefits"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of as many reps as possible (AMRAP)
                        </a>
                      </li>
                      <li>
                        Walking Lunges:{' '}
                        <a
                          href="https://www.verywellfit.com/how-to-do-a-walking-lunge-3435089"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 10 reps per leg
                        </a>
                      </li>
                      <li>
                        Plank:{' '}
                        <a
                          href="https://www.mayoclinic.org/healthy-lifestyle/fitness/multimedia/plank/art-20047685"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets, hold for 30-60 seconds
                        </a>
                      </li>
                      <li>
                        Glute Bridges:{' '}
                        <a
                          href="https://www.muscleandfitness.com/workout-plan/exercises/glute-bridge/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 15-20 reps
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Day 2: Cardio & Core</strong>
                    <ul className="list-inside list-disc pl-5">
                      <li>
                        Jumping Jacks:{' '}
                        <a
                          href="https://www.verywellfit.com/jumping-jacks-3120747"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 30 seconds
                        </a>
                      </li>
                      <li>
                        High Knees:{' '}
                        <a
                          href="https://www.runnersworld.com/training/a20814198/ask-the-coach-perfect-form-for-high-knees/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 30 seconds
                        </a>
                      </li>
                      <li>
                        Butt Kicks:{' '}
                        <a
                          href="https://www.triathlete.com/training/run-training/increase-speed-and-efficiency-with-butt-kicks/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 30 seconds
                        </a>
                      </li>
                      <li>
                        Crunches:{' '}
                        <a
                          href="https://www.verywellfit.com/how-to-do-crunches-1231158"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 15-20 reps
                        </a>
                      </li>
                      <li>
                        Russian Twists:{' '}
                        <a
                          href="https://www.menshealth.com/fitness/a19546133/the-russian-twist/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 15-20 reps per side
                        </a>
                      </li>
                      <li>
                        Bicycle Crunches:{' '}
                        <a
                          href="https://www.bodybuilding.com/exercises/bicycle-crunch"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 15-20 reps per side
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Day 3: Rest</strong>
                  </li>
                  <li>
                    <strong>Day 4: Upper Body & Core</strong>
                    <ul className="list-inside list-disc pl-5">
                      <li>
                        Incline Push-ups (using a wall or elevated surface):{' '}
                        <a
                          href="https://www.wikihow.com/Do-an-Incline-Pushup"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of AMRAP
                        </a>
                      </li>
                      <li>
                        Pike Push-ups:{' '}
                        <a
                          href="https://www.muscleandfitness.com/workout-plan/exercises/pike-pushup/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of as many reps as possible (AMRAP) (if you
                          can't do these, stick to incline push-ups)
                        </a>
                      </li>
                      <li>
                        Superman:{' '}
                        <a
                          href="https://www.verywellfit.com/how-to-do-the-superman-exercise-3887656"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 15-20 reps
                        </a>
                      </li>
                      <li>
                        Bird Dog:{' '}
                        <a
                          href="https://www.verywellfit.com/how-to-do-the-bird-dog-exercise-4845575"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 10 reps per side
                        </a>
                      </li>
                      <li>
                        Reverse Crunches:{' '}
                        <a
                          href="https://www.bodybuilding.com/exercises/reverse-crunch"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 15-20 reps
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Day 5: Lower Body & Cardio</strong>
                    <ul className="list-inside list-disc pl-5">
                      <li>
                        Squat Jumps:{' '}
                        <a
                          href="https://www.menshealth.com/fitness/a19546509/jump-squats/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 10-12 reps
                        </a>
                      </li>
                      <li>
                        Calf Raises:{' '}
                        <a
                          href="https://www.verywellfit.com/how-to-do-calf-raises-4841721"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 15-20 reps
                        </a>
                      </li>
                      <li>
                        Side Lunges:{' '}
                        <a
                          href="https://www.verywellfit.com/side-lunge-variations-4692807"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 10 reps per leg
                        </a>
                      </li>
                      <li>
                        Mountain Climbers:{' '}
                        <a
                          href="https://www.runnersworld.com/training/g20122005/ask-the-coach-mountain-climbers/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 30 seconds
                        </a>
                      </li>
                      <li>
                        Burpees (modify by stepping out instead of jumping):{' '}
                        <a
                          href="https://www.menshealth.com/fitness/a19545949/the-new-rules-of-burpees/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          3 sets of 8-10 reps
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <h3 className="text-xl font-semibold mt-4">Important Notes:</h3>
                <ul className="list-disc pl-5">
                  <li>
                    <strong>Listen to your body:</strong> If you feel pain, stop
                    the exercise and rest. Don't push yourself too hard,
                    especially at the beginning.
                  </li>
                  <li>
                    <strong>Stay Consistent:</strong> Consistency is key. Try to
                    stick to the workout schedule as much as possible.
                  </li>
                  <li>
                    <strong>Proper Form:</strong> Focus on maintaining proper
                    form to prevent injuries. Watch videos and pay attention to
                    your body mechanics.
                  </li>
                  <li>
                    <strong>Enjoy it!</strong> Find ways to make your workouts
                    enjoyable. This will help you stay motivated and consistent.
                  </li>
                </ul>
                <p className="mt-4">
                  Good luck with your fitness journey! Remember to combine this
                  workout plan with a healthy diet for optimal results.
                </p>
                <Link
                  href="#top"
                  className="inline-flex items-center mt-4 text-blue-400 hover:underline"
                >
                  <ArrowUpCircle className="mr-2 h-5 w-5" />
                  Back to Top
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gray-900 text-gray-400 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} FitFlow AI. All rights reserved.</p>
          <div className="flex space-x-4">
             <a href="/" className="hover:text-gray-300">Home</a>
            <a href="mailto:likhithpalya@gmail.com" className="hover:text-gray-300">
              likhithpalya@gmail.com
            </a>
            <a href="/about" className="hover:text-gray-300">About</a>
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

