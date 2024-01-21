import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { loginValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/loader";
import { ERROR } from "@/types";
import { useUserContext } from "@/context/AuthContext";
function SigninForm() {
  const navigate = useNavigate();
  const {checkAuthUser} = useUserContext();
  const {mutateAsync: signInAccount,isPending:isSigningIn} = useSignInAccount();
  const form = useForm<z.infer<typeof loginValidation>>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof loginValidation>) {
    const signingInResult = await signInAccount({email: values.email, password: values.password})
    if (signingInResult.status == ERROR) {
      toast({
        variant: "destructive",
        title: "Log in failed!",
        description: `Email or password is wrong`,
      });
      return;
    }
    const isLoggedIn = await checkAuthUser() ;  
    if(isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        variant: "destructive",
        title: "Sign in failed! Please try again.",
        // description: `Failed to login after creation of user account.`,
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-col flex-center">
        <img src="/assets/images/logo.svg"/>
        <h2 className="h3-bold md:h2-bold pt-4 m-0">Log in to your account.</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2 mb-2" >Welcome back! please enter your details.</p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-center flex-col gap-4 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full md:w-70">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full md:w-70">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary flex-center w-full md:w-70 mt-4" >
            {isSigningIn? (<div className="flex gap-1 " ><Loader/> Loading...</div>) :("Log in")}
          </Button>
          <p className="text-center mt-2 text-small-regular text-light-2">
            You don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SigninForm;
