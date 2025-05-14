"use client"

import React, { useEffect, useRef, useState } from 'react'
import { User } from '../../../types/user'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { UserOperation } from '@/app/api/user';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { Metadata } from 'next';

export default function UsersPage() {

    const toast = useRef<Toast>(null)
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([])
    const items: { id: number; name: string; email: string; phone: string; website: string }[] =
        Array.from({ length: 5 }, (_, i) => ({
            id: i,
            name: '',
            email: '',
            phone: '',
            website: ''
        }));

    useEffect(() => {
        async function getUsersList() {
            const userOp = new UserOperation();
            try {
                const response = await userOp.getAllUsers()
                setUsers(response.data || [])
            } catch (error: any) {
                const mes = error.message;
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: mes,
                    life: 3000,
                });
            }
        }
        getUsersList()
    }, []);

    const renderAction = (rowData: User) => {
        return (
            <Button label="Show" icon="pi pi-eye" size="small" severity="secondary" outlined
                onClick={() => router.push(`/users/${rowData.id}`)} />
        )
    }

    return (
        <div className='card'>
            <Toast ref={toast}></Toast>
            <div className='text-4xl font-bold mb-4'>
                Users
            </div>
            {users.length > 0 ? (
                <DataTable value={users} removableSort selectionMode={"single"} tableStyle={{ minWidth: '50rem' }} className='text-sm'>
                    <Column sortable field="id" header="ID"></Column>
                    <Column header="Avatar" body={(rowData) => (
                        <img src={`https://ui-avatars.com/api/?name=${rowData.name}&background=random&rounded=true`}
                            alt={rowData.name} style={{ width: '2em', height: '2em' }}></img>
                    )}></Column>
                    <Column sortable field="name" header="Name"></Column>
                    <Column sortable field="email" header="Email" body={(rowData) => (
                        <a href={`mailto:${rowData.email}`} style={{ color: '#007bff', textDecoration: 'underline' }}>
                            {rowData.email}
                        </a>
                    )}></Column>
                    <Column sortable field="phone" header="Phone" body={(rowData) => (
                        <a href={`tel:${rowData.phone}`} style={{ color: '#007bff', textDecoration: 'underline' }}>
                            {rowData.phone}
                        </a>
                    )}></Column>
                    <Column sortable field="website" header="Website" body={(rowData) => (
                        <a
                            href={`https://${rowData.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#007bff', textDecoration: 'underline' }}
                        >
                            {rowData.website}
                        </a>
                    )}></Column>
                    <Column body={renderAction} header="Actions" style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            ) : (
                <DataTable value={items} className="p-datatable-striped">
                    <Column field="id" header="Id" style={{ width: '25%' }} body={<Skeleton />}></Column>
                    <Column header="Avatar" style={{ width: '25%' }} body={<Skeleton />}></Column>
                    <Column field="name" header="Name" style={{ width: '25%' }} body={<Skeleton />}></Column>
                    <Column sortable field="email" header="Email" body={<Skeleton />}></Column>
                    <Column sortable field="phone" header="Phone" body={<Skeleton />}></Column>
                    <Column sortable field="website" header="Website" body={<Skeleton />}></Column>
                    <Column header="Actions" style={{ minWidth: '8rem' }} body={<Skeleton />}></Column>
                </DataTable>
            )}

        </div>
    )
}
