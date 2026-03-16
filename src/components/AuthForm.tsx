import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import FormField from "./FormField"
import { useAuth } from "@/contexts/AuthContext"

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8).max(32),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values;

        const result = await signUp(name!, email, password);

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in");
        navigate('/sign-in');

      } else {
        const { email, password } = values;

        const result = await signIn(email, password);

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Signed in successfully");
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <img src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3>Practice job interview with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-4 form">

            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Email"
              type="text"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="password"
              type="password"
            />

            <Button className="btn" type="submit">{isSignIn ? "Sign in" : "Create an Account"}</Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet? " : "Have an account already? "}
          <Link to={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
            {!isSignIn ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
