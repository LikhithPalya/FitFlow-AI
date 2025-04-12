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
import {toast} from '@/hooks/use-toast';
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
      toast({
        title: 'Workout plan generated!',
        description: 'Scroll down to view your workout plan.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
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
      toast({
        title: 'Workout plan adapted!',
        description: 'Scroll down to view your adapted workout plan.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
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
      <Card className="w-full max-w-2xl mx-auto my-8 bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>FitFlow AI - Personalized Workout Plan</CardTitle>
          <CardDescription>
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
                        className="bg-gray-700 text-white"
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
                        className="bg-gray-700 text-white"
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
                        className="bg-gray-700 text-white"
                      />
                    </FormControl>
                    <FormDescription>
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
                        className="bg-gray-700 text-white"
                      />
                    </FormControl>
                    <FormDescription>
                      What equipment do you have access to for your workouts?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
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
        <div ref={workoutPlanRef}>
          <Card className="w-full max-w-3xl mx-auto my-8 bg-gray-800 text-white animate-in fade-in duration-700">
            <CardHeader>
              <CardTitle>Generated Workout Plan</CardTitle>
              <CardDescription>
                Here is your <b>personalized</b> workout plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Workout Plan</Label>
                <ul className="list-disc pl-5 text-lg">
                  {workoutPlan.split('\n').map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {adaptedWorkoutPlan && (
        <Card className="w-full max-w-3xl mx-auto my-8 bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Adapted Workout Plan</CardTitle>
            <CardDescription>
              Based on your feedback, here is the <b>adapted</b> workout plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Adapted Workout Plan</Label>
              <ul className="list-disc pl-5 text-lg">
                {adaptedWorkoutPlan.split('\n').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            {explanation && (
              <div>
                <Label>Explanation</Label>
                <Textarea value={explanation} readOnly className="bg-gray-700 text-white" />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
