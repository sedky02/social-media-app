import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signupValidation } from "@/lib/validation";
import Loader from "@/components/shared/loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ERROR, SUCCESS } from "@/types";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

function SignupForm() {
  const {checkAuthUser, isLoading:isUserLoading} = useUserContext();
  const {mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUserAccount();
  const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof signupValidation>) {
    const creatingUserResult = await createUserAccount(values);
    if (creatingUserResult.status == ERROR) {
      return toast({
        variant: "destructive",
        title: "Sign up failed! Please try again.",
        description: `${creatingUserResult.message}`,
      });
      
    }
    if (creatingUserResult.status == SUCCESS){
      toast({
        variant: "success",
        title: `${creatingUserResult.message}`,
      });
    }
   
    const signingInResult = await signInAccount({email: values.email, password: values.password})
    if (signingInResult.status == ERROR) {
      toast({
        variant: "destructive",
        title: "Creating session failed!",
        description: `${signingInResult.message}`,
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
        description: `Failed to login after creation of user account.`,
      });
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420  flex-center flex-col ">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold  pt-2 ">Create new account</h2>
        <p className="text-light-3 small-medium md:base-regular mb-2  ">
          To use Snapgram enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary flex-center">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader /> loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-center  text-small-regular text-light-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignupForm;
