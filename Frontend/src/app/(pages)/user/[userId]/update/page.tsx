import React from 'react'
import { Metadata } from 'next'
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import UpdateUserForm from './UpdateUserForm';

export const metadata: Metadata = {
  title: "Update User",
  description: "Update User",
};

async function UpdateUser() {
  return (
    <Authenticate>
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="mx-auto w-full max-w-md py-12 md:max-w-lg lg:max-w-xl 2xl:pb-8 2xl:pt-2">
          <UpdateUserForm />
        </div>
      </Authorize>
    </Authenticate>
  )
}

export default UpdateUser
