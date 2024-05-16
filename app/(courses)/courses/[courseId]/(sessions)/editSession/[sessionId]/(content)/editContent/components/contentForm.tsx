"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { Content } from "@/interface/interface";

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    url: z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
        lastModified: z.number(),
        lastModifiedDate: z.date(),
    }),
    // Add more fields as needed
});

type ContentFormValue = z.infer<typeof formSchema>;

interface ContentFormProps {
    initialData?: Content;
}

export const ContentForm: React.FC<ContentFormProps> = ({ initialData }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const title = initialData ? "Edit the content" : "Create a content";
    const description = initialData ? "Edit the content" : "Add a new content";
    const toastMessage = initialData
        ? "Course has been updated"
        : "Course has been created";
    const action = initialData ? "Save changes" : "Create";
    console.log("initialData", initialData);
    const form = useForm<ContentFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            title: "",
            url: {
                name: "",
                size: 0,
                type: "",
                lastModified: 0,
                lastModifiedDate: new Date(),
            },
            // Initialize more fields here
        },
    });

    const onSubmit = async (data: ContentFormValue) => {
        try {
            setLoading(true);
            // Implement your API call here to create or update the content
            // Example: await axios.post('/api/contents', data);
            // Example: await axios.patch(`/api/contents/${initialData.id}`, data);
            console.log(data);
            // Simulate a delay before proceeding
            setTimeout(() => {
                console.log(data); // Log the data after 2 seconds
                toast.success(toastMessage);
                router.push("/courses"); // Redirect to the courses page after submission
                // Delay the setLoading(false) call to simulate server delay
                setTimeout(() => {
                    setLoading(false); // Reset loading state after another 2 seconds
                }, 2000);
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong");
            setLoading(false); // Reset loading state if an error occurs
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            // Implement your API call here to delete the content
            // Example: await axios.delete(`/api/contents/${initialData.id}`);

            console.log(
                `${initialData?.title} Course has been deleted successfully.`
            );
            toast.success(
                `${initialData?.title} Course has been deleted successfully.`
            );
            // router.push("/contents"); // Redirect to the contents page after deletion
        } catch (error) {
            console.error("Error:", error);
            toast.error("Make sure you remove all content dependencies first");
        } finally {
            setOpen(false);
            setLoading(false);
        }
    };

    return (
        <div className="w-4/6 h-fit mt-10 mx-auto">
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
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
                        name="title"
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
                        name="url"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                                <FormLabel>Attache File</FormLabel>
                                <FormControl>
                                    <Input
                                        {...fieldProps}
                                        placeholder="attach file"
                                        type="file"
                                        accept="image/*, application/pdf , video/*"
                                        onChange={(event) =>
                                            onChange(event.target.files && event.target.files[0])
                                        }
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
