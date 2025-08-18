import React from 'react'

function TextErrorCard({message}: {message: string}) {
  return (
      <div className="mx-auto relative flex flex-col mt-6 text-gray-700 bg-white dark:bg-black shadow-md bg-clip-border rounded-xl w-96">
          <div className="text-center p-6">
              {/* <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                  UI/UX Review Check
              </h5> */}
              <p className="block font-semibold font-sans text-base antialiased leading-relaxed text-inherit">
                  {message}
              </p>
          </div>
      </div>
  )
}

export default TextErrorCard