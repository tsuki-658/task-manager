import Heading from "@/components/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { CommentType, SharedData, SubTaskType, User } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { SendHorizontal } from "lucide-react";

interface CommentPageProps {
  subTask: SubTaskType;
  comments: CommentType[];
  student: User;
  creator: User;
}

export default function Comment({ subTask, comments, student, creator }: CommentPageProps) {
    const { auth } = usePage<SharedData>().props;
   const { data, setData, post, processing } = useForm({ 
    comment: '',
    teacher_id: creator.id,
    student_id: student.id
});

    const handleSendComment = () => {
        setData('comment', ""); 
        post(`/sub-task/${subTask.id}/comment`, {
            onSuccess: () => setData('comment', ''),
        });
    };



    return (
        <AppLayout>
            <Head title="Comment"/>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading title={subTask.title}/>
                <p>Task Creator: {creator.name}</p>
                <p>Student: {student.name}</p>
                <div className="min-h-24 space-y-6">

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Comment Section</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 h-72 overflow-y-auto">
                                {comments.length <= 0 && (
                                    <CardDescription>No Comment yet</CardDescription>
                                )}
                                {comments.map(comment => {
                                    const isTeacher = subTask.task.creator_id === comment.sender_id;
                                    const role = isTeacher ? 'Teacher' : 'Student'
                                    return (

                                    
                                    <div key={comment.id} className="grid grid-cols-[auto_1fr] gap-2">
                                        <p className="font-medium">{role}</p>
                                        <p>{comment.comment}</p>
                                    </div>
                                )})}

                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-2">
                    <Textarea
                        value={data.comment}
                        onChange={(e) => setData('comment', e.target.value)}
                    />
                    <button
                        onClick={() => handleSendComment()}
                        className="cursor-pointer p-2 rounded bg-gray-200 hover:bg-gray-300"
                        disabled={processing || !data.comment.trim()}
                    >
                        <SendHorizontal className="w-5 h-5" />
                    </button>
                </div>

                </div>
            </div>
        </AppLayout>
    );
}
