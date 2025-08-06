import React from 'react'
import { Metadata } from 'next'
import UserForm from './userForm';
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";

export const metadata: Metadata = {
  title: "Create User",
  description: "Create User",
};

async function CreateUser() {
  return (
    <Authenticate>
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
          <UserForm />
        </div>
      </Authorize>
    </Authenticate>
  )
}

export default CreateUser
