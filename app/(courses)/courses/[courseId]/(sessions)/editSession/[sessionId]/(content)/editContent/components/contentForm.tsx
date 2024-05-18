"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertModal } from "@/components/modals/alert-modal";
import { Content } from "@/types/interface";
import usePostRequest from "@/app/actions/usePostRequest ";

const formSchema = z.object({
  //   title: z.string().min(1, { message: "Title is required" }),
  //   url: z.object({
  //     name: z.string(),
  //     size: z.number(),
  //     type: z.string(),
  //     lastModified: z.number(),
  //     lastModifiedDate: z.date(),
  //   }),
  filename: z
    .instanceof(FileList)
    .refine((file) => file?.length == 1, "File is required."),
  name: z.string().min(1, { message: "Name is required" }),
  // Add more fields as needed
});

type ContentFormValue = z.infer<typeof formSchema>;

interface ContentFormProps {
  initialData?: Content;
}
const transformToFormData = (content: Content): ContentFormValue => {
  return {
    filename: content.filename instanceof FileList ? content.filename : new DataTransfer().files,
    name: content.name,
  };
};
export const ContentForm: React.FC<ContentFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { postData, loading } = usePostRequest();
  const param = useParams();

  const title = initialData ? "Edit the content" : "Create a content";
  const description = initialData ? "Edit the content" : "Add a new content";
  const toastMessage = initialData
    ? "Course has been updated"
    : "Course has been created";
  const action = initialData ? "Save changes" : "Create";

  // console.log("initialData", initialData);
  console.log(param);

  const form = useForm<ContentFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? transformToFormData(initialData) : {
      filename: new DataTransfer().files,
      name: "",
      //   title: "",
      //   url: {
      //     name: "",
      //     size: 0,
      //     type: "",
      //     lastModified: 0,
      //     lastModifiedDate: new Date(),
      //   },
      // Initialize more fields here
    },
  });

  const fileRef = form.register("filename");
  const onSubmit = async (data: ContentFormValue) => {
    try {
      await postData({
        url: `courses/${param.courseId}/sessions/${param.sessionId}/content`,
        data: data,
        onSuccess: () => {
          toast.success(toastMessage);
          router.push("/courses");
        },
      });
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again later.");
    }
  };

  //   const onDelete = async () => {
  //     try {

  //       // Implement your API call here to delete the content
  //       // Example: await axios.delete(`/api/contents/${initialData.id}`);

  //       console.log(
  //         `${initialData?.title} Course has been deleted successfully.`
  //       );
  //       toast.success(
  //         `${initialData?.title} Course has been deleted successfully.`
  //       );
  //       // router.push("/contents"); // Redirect to the contents page after deletion
  //     } catch (error) {
  //       console.error("Error:", error);
  //       toast.error("Make sure you remove all content dependencies first");
  //     } finally {
  //       setOpen(false);

  //     }
  //   };

  return (
    <div className="w-4/6 h-fit mt-10 mx-auto">
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator className="my-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    disabled={loading}
                    placeholder="Course title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="filename"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Attache File</FormLabel>
                <FormControl>
                  <Input
                    {...fileRef}
                    placeholder="attach file"
                    className="w-full rounded-sm dark:border-blue-50 border-1 outline-dashed outline-1 outline-blue-50"
                    type="file"
                    accept="image/*, application/pdf , video/*"
                    onChange={(event) => {
                      console.log(event.target.files && event.target.files[0]);
                      onChange(event.target.files && event.target.files[0]);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Add more form fields as needed */}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
};
