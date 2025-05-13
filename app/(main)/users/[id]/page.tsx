"use client"

import { UserOperation } from '@/app/api/user';
import { User, UserAlbums } from '@/types/user';
import { url } from 'inspector';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'

export default function DetailUser() {

    const router = useRouter();

    const toast = useRef<Toast>(null)

    const [user, setUser] = useState<User | null>(null);
    const [userAlbums, setUserAlbums] = useState<UserAlbums[]>([]);

    const { id } = useParams();

    const items = [
        { label: 'Show' },
    ];
    const home = {
        icon: 'pi pi-id-card', label: 'Users', url: '/users'
    };

    useEffect(() => {
        async function getUserAndUserAlbum(id: string) {
            const userOp = new UserOperation();
            try {
                const resUser = await userOp.getUserByID(id)
                setUser(resUser.data || null)
                const resAlbums = await userOp.getUserAlbums(id)
                setUserAlbums(resAlbums.data || [])
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

        getUserAndUserAlbum(id)
    }, []);

    const renderAction = (rowData: User) => {
        return (
            <Button label="Show" icon="pi pi-eye" size="small" severity="secondary" outlined
                onClick={() => router.push(`/albums/${rowData.id}`)} />
        )
    }

    return (
        <div>
            <div className='mb-4'>
                <BreadCrumb model={items} home={home} className='border-none text-lg' style={{ backgroundColor: 'var(--surface-ground)' }} />
            </div>

            <div className='card'>
                <div className='card'>
                    <div className="flex items-start gap-4">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name}&background=random&rounded=true`}
                            alt={user?.name}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="text-base font-semibold text-gray-800">{user?.name}</div>
                            <a
                                href={`mailto:${user?.email}`}
                                className="text-blue-600 underline block"
                            >
                                {user?.email}
                            </a>
                        </div>
                    </div>

                    <Divider />

                    <div className='text-2xl font-bold my-4'>
                        Albums
                    </div>

                    <DataTable value={userAlbums} removableSort selectionMode={"single"} tableStyle={{ minWidth: '50rem' }} className='text-sm'>
                        <Column sortable field="id" header="ID"></Column>
                        <Column sortable field="title" header="Title"></Column>
                        <Column body={renderAction} header="Actions" style={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>


    )
}
