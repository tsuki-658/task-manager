import AppLayout from "@/layouts/app-layout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { User } from "@/types";
import * as React from "react";

import {
  Button,
} from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



export default function UserManagement({ users }: { users: User[] }) {

  const authUser = usePage<any>().props.auth.user;

  type UserType = {
    id: number;
    name: string;
    email: string;
    role: string;
  };

  const columns: ColumnDef<UserType>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        const canEdit =
          authUser.role === "admin" ||
          (authUser.role === "teacher" && item.role === "user");

        const canDelete = canEdit; // same logic

        return (
          <div className="space-x-2">
            {canEdit && (
              <Button size="sm" onClick={() => openEdit(item)}>
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => openDelete(item)}
              >
                Delete
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [createOpen, setCreateOpen] = React.useState(false);
  const createForm = useForm({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  const submitCreate = () => {
    createForm.post("/user-management", {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const [editOpen, setEditOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<UserType | null>(null);

  const editForm = useForm({
    name: "",
    email: "",
    role: "user",
  });

  function openEdit(user: UserType) {
    setEditingUser(user);
    editForm.setData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setEditOpen(true);
  }

  const submitEdit = () => {
    if (!editingUser) return;

    editForm.put(`/user-management/${editingUser.id}`, {
      onSuccess: () => setEditOpen(false),
    });
  };

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deletingUser, setDeletingUser] = React.useState<UserType | null>(null);

  function openDelete(user: UserType) {
    setDeletingUser(user);
    setDeleteOpen(true);
  }

  const confirmDelete = () => {
    if (!deletingUser) return;

    router.delete(`/user-management/${deletingUser.id}`, {
      onSuccess: () => setDeleteOpen(false),
    });
  };

  return (
    <AppLayout>
      <Head title="User Management" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">User Management</h1>

          {(authUser.role === "admin" || authUser.role === "teacher") && (
            <Button onClick={() => setCreateOpen(true)}>Create User</Button>
          )}
        </div>

        {/* TABLE */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Fill in user details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                value={createForm.data.name}
                onChange={(e) => createForm.setData("name", e.target.value)}
              />
              {createForm.errors.name && (
                <p className="text-red-500 text-sm">{createForm.errors.name}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={createForm.data.email}
                onChange={(e) => createForm.setData("email", e.target.value)}
              />
              {createForm.errors.email && (
                <p className="text-red-500 text-sm">{createForm.errors.email}</p>
              )}
            </div>

            <div>
              <Label>Role</Label>
              <Select
                value={createForm.data.role}
                onValueChange={(value) => createForm.setData("role", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* ADMIN CREATE USER, TEACHER */}
                  {authUser.role === "admin" && (
                    <>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </>
                  )}

                  {/* TEACHER CREATE USER */}
                  {authUser.role === "teacher" && (
                    <SelectItem value="user">User</SelectItem>
                  )}
                </SelectContent>
              </Select>

              {createForm.errors.role && (
                <p className="text-red-500 text-sm">{createForm.errors.role}</p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={createForm.data.password}
                onChange={(e) => createForm.setData("password", e.target.value)}
              />
              {createForm.errors.password && (
                <p className="text-red-500 text-sm">{createForm.errors.password}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={submitCreate} disabled={createForm.processing}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL*/}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                value={editForm.data.name}
                onChange={(e) => editForm.setData("name", e.target.value)}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={editForm.data.email}
                onChange={(e) => editForm.setData("email", e.target.value)}
              />
            </div>

            <div>
              <Label>Role</Label>
              <Select
                value={editForm.data.role}
                onValueChange={(value) => editForm.setData("role", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {authUser.role === "admin" && (
                    <>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </>
                  )}

                  {authUser.role === "teacher" && (
                    <SelectItem value="user">User</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={submitEdit} disabled={editForm.processing}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL*/}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingUser?.name}</strong>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
