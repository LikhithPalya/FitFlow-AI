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
  const [workoutPlan, setWorkoutPlan] = useState<string | undefined>(undefined);
  const [adaptedWorkoutPlan, setAdaptedWorkoutPlan] = useState<string | undefined>(
    undefined
  );
  const [explanation, setExplanation] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const workoutPlanRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: '',
      weight: '',
      fitnessGoals: '',
      availableEquipment: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const generatedPlan = await generateWorkoutPlan({
        age: Number(values.age),
        weight: Number(values.weight),
        fitnessGoals: values.fitnessGoals,
        availableEquipment: values.availableEquipment,
      });
      setWorkoutPlan(generatedPlan.workoutPlan);
      toast.success('Workout plan generated!', {
        duration: 3000,
        position: 'bottom-center',
      });
    } catch (error: any) {
      toast.error('Uh oh! Something went wrong.', {
        duration: 3000,
        position: 'bottom-center',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onAdapt(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (!values.workoutPlan) {
        throw new Error('Workout plan is required to adapt.');
      }

      const adaptedPlan = await adaptWorkoutPlan({
        workoutPlan: values.workoutPlan,
        feedback: values.feedback || 'The workout plan is good.',
        userProfile: JSON.stringify({
          age: values.age,
          weight: values.weight,
          fitnessGoals: values.fitnessGoals,
          availableEquipment: values.availableEquipment,
        }),
      });
      setAdaptedWorkoutPlan(adaptedPlan.adaptedWorkoutPlan);
      setExplanation(adaptedPlan.explanation);
      toast.success('Workout plan adapted!', {
        duration: 3000,
        position: 'bottom-center',
      });
    } catch (error: any) {
      toast.error('Uh oh! Something went wrong.', {
        duration: 3000,
        position: 'bottom-center',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (workoutPlanRef.current) {
      workoutPlanRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [workoutPlan]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-4 md:p-8">
      <Card className="w-full max-w-2xl mx-auto my-8 bg-gray-800 text-white rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">FitFlow AI - Personalized Workout Plan</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your details to generate a personalized workout plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="age"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your age"
                        {...field}
                        className="bg-gray-700 text-white rounded-md"
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
                        placeholder="Enter your weight in kilograms"
                        {...field}
                        className="bg-gray-700 text-white rounded-md"
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
                        placeholder="Describe your fitness goals"
                        {...field}
                        className="bg-gray-700 text-white rounded-md"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      What do you want to achieve with your workout plan?
                    </FormDescription>
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
                        placeholder="List the equipment you have available"
                        {...field}
                        className="bg-gray-700 text-white rounded-md"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      What equipment do you have access to for your workouts?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Workout Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {workoutPlan && (
        <div ref={workoutPlanRef} className="scroll-mt-20 animate-fade-in duration-700">
          <Card className="w-full max-w-4xl mx-auto my-8 bg-gray-800 text-white rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Generated Workout Plan</CardTitle>
              <CardDescription className="text-gray-400">
                Here is your <b>personalized</b> workout plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xl">Workout Plan</Label>
                <div className="text-lg">
                  <p>Okay, here's a 20-day bodyweight workout plan designed to get you fitter, focusing on consistency and progression. Remember to consult your doctor before starting any new workout program. This plan assumes you have no equipment available.</p>
                  <br />
                  <p className="font-semibold">Important Considerations:</p>
                  <ul className="list-disc pl-5">
                    <li><span className="font-semibold">Warm-up (5-10 minutes before each workout):</span> Dynamic stretching like arm circles, leg swings, torso twists, and high knees.</li>
                    <li><span className="font-semibold">Cool-down (5-10 minutes after each workout):</span> Static stretching, holding each stretch for 30 seconds (e.g., hamstring stretch, quad stretch, calf stretch, tricep stretch).</li>
                    <li><span className="font-semibold">Rest:</span> Take rest days when needed. Listen to your body. It's better to rest than to push through pain and risk injury.</li>
                    <li><span className="font-semibold">Hydration:</span> Drink plenty of water throughout the day, especially before, during, and after workouts.</li>
                    <li><span className="font-semibold">Nutrition:</span> This is crucial for fitness. Focus on a balanced diet with plenty of protein, fruits, vegetables, and whole grains.</li>
                    <li><span className="font-semibold">Progression:</span> As exercises become easier, increase the repetitions, sets, or difficulty (e.g., try a harder variation of the exercise).</li>
                  </ul>
                  <br />
                  <p className="font-semibold">Workout Schedule (Repeat this 5-day cycle four times within 20 days, adjusting reps/sets as needed):</p>
                  <ul className="list-disc pl-5">
                    <li><span className="font-semibold">Day 1: Full Body Strength</span>
                      <ul className="list-disc pl-5">
                        <li>Squats: <a href="https://www.nerdfitness.com/blog/a-beginners-guide-to-squats-infographic/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 12-15 reps</a></li>
                        <li>Push-ups (modify on knees if needed): <a href="https://www.nerdfitness.com/blog/proper-push-up/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of as many reps as possible (AMRAP)</a></li>
                        <li>Walking Lunges: <a href="https://www.nerdfitness.com/blog/how-to-do-lunges-properly/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 10 reps per leg</a></li>
                        <li>Plank: <a href="https://www.nerdfitness.com/blog/the-super-plank-exercise-your-way-to-a-stronger-core/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets, hold for 30-60 seconds</a></li>
                        <li>Glute Bridges: <a href="https://www.nerdfitness.com/blog/the-glute-bridge-exercise-your-butt-will-thank-you/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 15-20 reps</a></li>
                      </ul>
                    </li>
                    <li><span className="font-semibold">Day 2: Cardio & Core</span>
                      <ul className="list-disc pl-5">
                        <li>Jumping Jacks: <a href="https://www.nerdfitness.com/blog/how-to-do-jumping-jacks/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 30 seconds</a></li>
                        <li>High Knees: <a href="https://www.wellandgood.com/high-knees/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 30 seconds</a></li>
                        <li>Butt Kicks: <a href="https://www.verywellfit.com/how-to-do-butt-kicks-1296973/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 30 seconds</a></li>
                        <li>Crunches: <a href="https://www.nerdfitness.com/blog/how-to-do-crunches-what-they-are-and-why-you-shouldnt-do-them/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 15-20 reps</a></li>
                        <li>Russian Twists: <a href="https://www.nerdfitness.com/blog/russian-twists/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 15-20 reps per side</a></li>
                        <li>Bicycle Crunches: <a href="https://www.verywellfit.com/how-to-do-a-bicycle-crunch-5677297/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 15-20 reps per side</a></li>
                      </ul>
                    </li>
                    <li><span className="font-semibold">Day 3: Rest</span></li>
                    <li><span className="font-semibold">Day 4: Upper Body & Core</span>
                      <ul className="list-disc pl-5">
                        <li>Incline Push-ups (using a wall or elevated surface): <a href="https://www.wikihow.com/Do-an-Incline-Push-Up" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of AMRAP</a></li>
                        <li>Pike Push-ups: <a href="https://www.nerdfitness.com/blog/pike-push-ups/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of as many reps as possible (AMRAP) (if you can't do these, stick to incline push-ups)</a></li>
                        <li>Superman: <a href="https://www.nerdfitness.com/blog/superman-exercise/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 15-20 reps</a></li>
                        <li>Bird Dog: <a href="https://www.nerdfitness.com/blog/bird-dog-exercise/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 10 reps per side</a></li>
                        <li>Reverse Crunches: <a href="https://www.wikihow.com/Do-Reverse-Crunches" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 15-20 reps</a></li>
                      </ul>
                    </li>
                    <li><span className="font-semibold">Day 5: Lower Body & Cardio</span>
                      <ul className="list-disc pl-5">
                        <li>Squat Jumps: <a href="https://www.nerdfitness.com/blog/squat-jumps/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 10-12 reps</a></li>
                        <li>Calf Raises: <a href="https://www.nerdfitness.com/blog/calf-raises/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 15-20 reps</a></li>
                        <li>Side Lunges: <a href="https://www.nerdfitness.com/blog/side-lunges/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 10 reps per leg</a></li>
                        <li>Mountain Climbers: <a href="https://www.nerdfitness.com/blog/mountain-climbers/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 30 seconds</a></li>
                        <li>Burpees (modify by stepping out instead of jumping): <a href="https://www.nerdfitness.com/blog/burpees/" className="text-teal-500 hover:text-teal-400" target="_blank">3 sets of 8-10 reps</a></li>
                      </ul>
                    </li>
                  </ul>
                  <br />
                  <p className="font-semibold">Exercise Explanations (if needed):</p>
                  <ul className="list-disc pl-5">
                    <li>(Search for each exercise online for visual demonstrations)</li>
                  </ul>
                  <br />
                  <p className="font-semibold">Important Notes:</p>
                  <ul className="list-disc pl-5">
                    <li><span className="font-semibold">Listen to your body:</span> If you feel pain, stop the exercise and rest. Don't push yourself too hard, especially at the beginning.</li>
                    <li><span className="font-semibold">Stay Consistent:</span> Consistency is key. Try to stick to the workout schedule as much as possible.</li>
                    <li><span className="font-semibold">Proper Form:</span> Focus on maintaining proper form to prevent injuries. Watch videos and pay attention to your body mechanics.</li>
                    <li><span className="font-semibold">Enjoy it!</span> Find ways to make your workouts enjoyable. This will help you stay motivated and consistent.</li>
                  </ul>
                  <br />
                  <p>Good luck with your fitness journey! Remember to combine this workout plan with a healthy diet for optimal results.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {adaptedWorkoutPlan && (
        <Card className="w-full max-w-3xl mx-auto my-8 bg-gray-800 text-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Adapted Workout Plan</CardTitle>
            <CardDescription className="text-gray-400">
              Based on your feedback, here is the <b>adapted</b> workout plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xl">Adapted Workout Plan</Label>
              <ul className="list-disc pl-5 text-lg">
                {adaptedWorkoutPlan.split('\n').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            {explanation && (
              <div>
                <Label className="text-xl">Explanation</Label>
                <Textarea value={explanation} readOnly className="bg-gray-700 text-white rounded-md" />
              </div>
            )}
          </CardContent>
        </Card>
      )}
      <Toaster/>
    </div>
  );
}
import { Toaster } from 'react-hot-toast';
