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
          <UpdateUserForm />
      </Authorize>
    </Authenticate>
  )
}

export default UpdateUser
