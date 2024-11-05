<template>
  <div class="">

    <!-- Reservation Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Reservations</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all moving reservations</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button @click.stop="openModalNewReservation()" class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Add Reservation</button>
      </div>
    </div>

    <!-- Reservation Search -->
    <div class="mt-8 flex items-center gap-2">
      <input v-model="searchText" type="text" name="search_text" id="search_text" class="px-2 block w-full max-w-sm rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6" placeholder="Search" />
      <button @click.stop="getReservations(true)" class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Search</button>
    </div>

    <!-- Reservations Table -->
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 max-w-sm">Nº</th>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 max-w-sm">Full Name</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm">Phone & Email</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm">Pickup</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm">Status</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm">Services</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-sm">Destination</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0 max-w-sm">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="!loadingReservations && reservations?.length" v-for="(reservation, indexAppointment) in reservations" :key="indexAppointment" class="even:bg-gray-100">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 max-w-sm">#{{ reservation?.reservationNumber}}</td>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0 max-w-sm">{{ reservation?.contactInfo?.firstName +' '+ reservation?.contactInfo?.lastName }}</td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div class="flex flex-col gap-2">
                    <span class="text-xs font-medium">- Phone: {{ reservation?.contactInfo?.phone}}</span>
                    <span class="text-xs font-medium">- Email:{{ reservation?.contactInfo?.email }}</span>
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-xs flex flex-col gap-2 truncate text-gray-500 max-w-sm">
                  <p class="font-medium truncate">- Date: {{ moment(reservation?.pickupInfo?.date).format('MMM Do YYYY') }} at {{ reservation?.pickupInfo?.time }}</p>
                  <p class="font-medium truncate">- Address: {{ reservation?.pickupInfo?.address?.formatted_address }}</p>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <p :class="['px-3 py-1 text-xs font-medium text-white rounded-full w-max mx-auto', reservation?.status === 'confirmed' ? 'bg-blue-500' : reservation?.status === 'canceled' ? 'bg-red-500' : reservation?.status === 'payed' ? 'bg-green-500' : reservation?.status === 'pending' ? 'bg-gray-500' : 'bg-blue-500']">{{reservation?.status}}</p>

                  <p v-if="reservation?.totalPrice && (reservation?.status == 'confirmed' || reservation?.status == 'payed')" :class="['px-3 py-1 text-xs font-medium text-white rounded-full w-max mx-auto mt-2', reservation?.status === 'confirmed' ? 'bg-blue-500' : reservation?.status === 'payed' ? 'bg-green-500' :'bg-blue-500']">{{reservation?.totalPrice}}$</p>

                </td>
                <td class="whitespace-nowrap px-3 py-4 text-xs text-gray-500 max-w-sm">
                  <ul class="list-none">
                    <li v-for="service in reservation?.selectedServicesType" :key="service.value">- {{service.name}}</li>
                  </ul>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-sm">
                  <div class="flex flex-col gap-2 truncate">
                    <p class="text-xs font-medium truncate">- Address: {{reservation?.destinationInfo?.address?.formatted_address}}</p>
                    <p class="text-xs font-medium truncate" v-if="reservation?.destinationInfo?.stops?.length" v-for="(stop, index) in reservation?.destinationInfo?.stops" >{{`- Stop ${index+1}: ${stop?.formatted_address}`}}</p>
                  </div>
                </td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 max-w-sm">
                  <button @click.stop="openModalDetails(reservation)" class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Details</button>
                </td>
              </tr>
              <tr v-else-if="!loadingReservations && !reservations?.length" class="even:bg-gray-100">
                <td colspan="6" class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">No Reservations Found</td>
              </tr>
              <tr v-else-if="loadingReservations" class="even:bg-gray-100">
                <td colspan="6" class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div class="space-x-3 flex w-max items-center m-auto">
                    <svg class="animate-spin -ml-1 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="font-semibold text-blue-600">Loading ...</span>
                  </div>
                </td>
              </tr>
              <tr v-if="reservationsError" class="even:bg-gray-100">
                <td colspan="6" class="whitespace-nowrap px-3 py-4 text-sm text-red-500 text-center">
                  {{reservationsError}}
                </td>
              </tr>
              <tr v-if="totalReservations > reservations?.length && !loadingReservations" class="even:bg-gray-100">
                <td colspan="8" class="whitespace-nowrap px-3 py-4 text-sm text-red-500 text-center">
                  <button v-if="!loadingLoadmoreAppointments" @click="loadMoreReservations()" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full">Load More</button>
                  <button v-else class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full justify-center">
                    <svg class="animate-spin h-5 w-5 text-blue-600 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Appointment Details -->
  <div v-if="modalDetailReservation && selectedReservationDetails" class="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div v-click-outside="closeModalDetails" class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">

          <div class="px-4 py-3 border-b border-gray-200 flex justify-between">
            <div class="flex flex-col gap-2 grow">
              <h2 class="text-gray-900 text-lg font-semibold">Reservation Details</h2>
              <p class="text-gray-500 text-sm">Detail of the reservation</p>
            </div>

            <div class="flex flex-col gap-2">
              <p class="text-gray-900 text-xs">Reservation Number: <span class="text-xs text-blue-500">#{{ selectedReservationDetails?.reservationNumber }}</span></p>
              <p class="text-gray-900 text-xs">Created At: <span class="text-xs text-blue-500">{{ selectedReservationDetails?.created_at }}</span></p>
              <p class="text-gray-900 text-xs">Last Update At: <span class="text-xs text-blue-500">{{ selectedReservationDetails?.updated_at }}</span></p>

              <p class="text-gray-900 text-xs">Status:
                <span :class="['px-2 py-1 text-[10px] font-medium text-white rounded-full w-max mx-auto', selectedReservationDetails?.status === 'confirmed' ? 'bg-blue-500' : selectedReservationDetails?.status === 'canceled' ? 'bg-red-500' : selectedReservationDetails?.status === 'payed' ? 'bg-green-500' : selectedReservationDetails?.status === 'pending' ? 'bg-gray-500' : 'bg-blue-500']">{{selectedReservationDetails?.status}}</span>
              </p>

              <p v-if="selectedReservationDetails?.payment?.price" class="text-gray-900 text-xs">Price:
                <span class="px-2 py-1 text-[10px] font-medium text-white rounded-full w-max mx-auto bg-green-600">{{selectedReservationDetails?.payment?.price}} USD</span>
              </p>
            </div>
          </div>
          <div class="px-4 py-6 max-h-[calc(100vh-280px)] overflow-y-auto">

              <!-- Contact Info Section -->
              <div class="">
                <h2 class="text-lg font-semibold text-blue-600">Contact Information</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 border-blue-600 border-2 p-4 rounded-lg mt-1">
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">First Name:</span> {{ selectedReservationDetails?.contactInfo?.firstName }}
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Last Name:</span> {{ selectedReservationDetails?.contactInfo?.lastName }}
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Email:</span> <a :href="`mailto:${selectedReservationDetails?.contactInfo?.email}`" class="text-blue-500 underline underline-offset-2">{{ selectedReservationDetails?.contactInfo?.email }}</a>
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Phone:</span> <a :href="`tel:${selectedReservationDetails?.contactInfo?.phone}`" class="text-blue-500 underline underline-offset-2">{{ selectedReservationDetails?.contactInfo?.phone }}</a>
                  </div>
                </div>
              </div>

              <!-- Customer Info Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Customer Information</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 border-blue-600 border-2 p-4 rounded-lg mt-1">
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Type:</span> {{ selectedReservationDetails?.customerInfo?.type }}
                  </div>
                  <div v-if="selectedReservationDetails?.customerInfo?.type == 'business'" class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Business Name:</span> {{ selectedReservationDetails?.customerInfo?.businessName }}
                  </div>
                </div>
              </div>

              <!-- Pickup Info Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Pickup Information</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 border-blue-600 border-2 p-4 rounded-lg mt-1">
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Date:</span> {{ moment(selectedReservationDetails?.pickupInfo?.date).format('MMM Do YYYY') }} at {{ selectedReservationDetails?.pickupInfo?.time }}
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Address:</span>
                    <a :href="`https://www.google.com/maps?q=${selectedReservationDetails?.pickupInfo?.address?.geometry?.location?.lat},${selectedReservationDetails?.pickupInfo?.address?.geometry?.location?.lng}`" target="_blank" class="text-blue-500 underline underline-offset-2 pl-2">{{ selectedReservationDetails?.pickupInfo?.address?.formatted_address }}</a>
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Building Type:</span> {{ selectedReservationDetails?.pickupInfo?.buildingType }}
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Floor Number:</span> {{ selectedReservationDetails?.pickupInfo?.floorNumber || '-' }}
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Complex:</span> {{ selectedReservationDetails?.pickupInfo?.complex || '-' }}
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Unit Number or Letter:</span> {{ selectedReservationDetails?.pickupInfo?.unitNumberOrLetter || '-' }}
                  </div>
                </div>
              </div>

              <!-- Services Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Services</h2>
                <div class="grid grid-cols-1 gap-2 border-blue-600 border-2 p-4 rounded-lg mt-1">
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">List Services:</span>
                    <ul class="list-disc pl-5 mt-3 flex flex-col gap-1">
                      <li v-for="service in selectedReservationDetails?.selectedServicesType" :key="service.value">{{service.name}}</li>
                    </ul>
                  </div>

                </div>
              </div>

              <!-- Destination Info Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Destination Information</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 border-blue-600 border-2 p-4 rounded-lg mt-1">

                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Address:</span>
                    <a :href="`https://www.google.com/maps?q=${selectedReservationDetails?.destinationInfo?.address?.geometry?.location?.lat},${selectedReservationDetails?.destinationInfo?.address?.geometry?.location?.lng}`" target="_blank" class="text-blue-500 underline underline-offset-2 pl-2">{{ selectedReservationDetails?.destinationInfo?.address?.formatted_address }}</a>
                  </div>
                  <div v-if="selectedReservationDetails?.destinationInfo?.stops?.length" class="text-sm text-blue-500 font-medium flex gap-2">
                    <span class="font-semibold text-gray-900">Stops:</span>
                    <ul class="list-disc pl-4">
                      <li v-for="stop in selectedReservationDetails?.destinationInfo?.stops" :key="stop.formatted_address">
                        <a :href="`https://www.google.com/maps?q=${stop?.geometry?.location?.lat},${stop?.geometry?.location?.lng}`" target="_blank" class="text-blue-500 underline underline-offset-2 pl-2">{{ stop?.formatted_address }}</a>
                      </li>
                    </ul>
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Building Type:</span> {{ selectedReservationDetails?.destinationInfo?.buildingType }}
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Floor Number:</span> {{ selectedReservationDetails?.destinationInfo?.floorNumber || '-' }}
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Complex:</span> {{ selectedReservationDetails?.destinationInfo?.complex || '-' }}
                  </div>
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Unit Number or Letter:</span> {{ selectedReservationDetails?.destinationInfo?.unitNumberOrLetter || '-' }}
                  </div>
                </div>
              </div>

              <!-- Additionals Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Additionals</h2>
                <div class="grid grid-cols-1 gap-2 border-blue-600 border-2 p-4 rounded-lg mt-1">
                  <div class="text-sm text-blue-500 font-medium">
                    <span class="font-semibold text-gray-900">Notes:</span>
                    {{selectedReservationDetails?.additionals?.notes}}
                  </div>

                </div>
              </div>
          </div>

          <!-- Actions -->
          <div class="border-t border-gray-200 p-5 flex gap-2 justify-between">

            <div class="flex items-center gap-2">
              <button @click.stop="closeModalDetails()" class="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-max">Close</button>
              <button @click.stop="confirmDeleteReservation()" :class="[loadingDeleteReservation ? 'disabled' : '', 'block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600']">Delete</button>
              <button @click.stop="editReservation()" :class="[loadingDeleteReservation ? 'disabled' : '', 'block rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600']">Edit</button>
            </div>

            <div class="flex items-center gap-2">

              <button v-if="selectedReservationDetails?.status == 'pending'" @click.stop="changeReservationStatus('canceled')" :class="[loadingReservationStatus ? 'disabled' : '', 'block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600']">Descline</button>

              <button v-if="selectedReservationDetails?.status == 'pending'" @click.stop="openModalConfirmReservation()" :class="[loadingReservationStatus ? 'disabled' : '', 'block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600']">Confirm</button>

              <button v-if="selectedReservationDetails?.status == 'canceled' || selectedReservationDetails?.status == 'payed'" @click.stop="changeReservationStatus('pending')" :class="[loadingReservationStatus ? 'disabled' : '', 'block rounded-md bg-gray-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500']">Make it Pending</button>

              <button v-if="selectedReservationDetails?.status == 'confirmed'" @click.stop="changeReservationStatus('payed')" :class="[loadingReservationStatus ? 'disabled' : '', 'block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600']">Pay</button>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- Modal Add New Appointment -->
  <div v-show="modalNewReservation" class="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div v-click-outside="closeModalNewReservation" class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">

          <div class="px-4 py-3 border-b border-gray-200 flex justify-between">
            <div class="flex flex-col gap-2 grow">
              <h2 class="text-gray-900 text-lg font-semibold">{{indexReservation != null && indexReservation >= 0 ? "Edit reservation" : "Add new reservation"}}</h2>
              <p class="text-gray-500 text-sm">{{indexReservation != null && indexReservation >= 0 ? "Edit reservation manually" : "Add new reservation manually"}}</p>
            </div>
          </div>
          <div class="px-4 py-6 max-h-[calc(100vh-200px)] overflow-auto">

              <!-- Contact Info Section -->
              <div class="">
                <h2 class="text-lg font-semibold text-blue-600">Contact Information</h2>
                <div class="grid grid-cols-2 gap-x-4 gap-y-6 border-blue-600 border-2 p-4 rounded-lg mt-1">

                  <!-- Fisrt Name -->
                  <div class="space-y-2 col-span-2 md:col-span-1">
                    <label for="contact_first_name" class="block text-sm font-semibold leading-6 text-gray-900 ">First Name</label>
                    <input v-model="contactInfo.firstName" type="text" name="first_name" id="contact_first_name" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"  />
                    <p v-if="listErrors?.includes('contact_first_name')" class="text-xs text-red-600 font-medium">First Name is requeried!</p>
                  </div>

                  <!-- Last name -->
                  <div class="space-y-2 col-span-2 md:col-span-1">
                    <label for="contact_last_name" class="block text-sm font-semibold leading-6 text-gray-900 ">Last Name</label>
                    <input v-model="contactInfo.lastName" type="text" name="last_name" id="contact_last_name" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                    <p v-if="listErrors?.includes('contact_last_name')" class="text-xs text-red-600 font-medium">Last Name is required!</p>
                  </div>

                  <!-- Phone -->
                  <div class="space-y-2 col-span-2 md:col-span-1">
                    <label for="contact_phone" class="block text-sm font-semibold leading-6 text-gray-900 ">Phone</label>
                    <input v-model="contactInfo.phone" @blur="formatPhone()" type="text" name="phone" id="contact_phone" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                    <p v-if="listErrors?.includes('contact_phone')" class="text-xs text-red-600 font-medium">Phone Number is Required!</p>
                  </div>

                  <!-- Email -->
                  <div class="space-y-2 col-span-2 md:col-span-1">
                    <label for="contact_email" class="block text-sm font-semibold leading-6 text-gray-900 ">Email</label>
                    <input v-model="contactInfo.email" type="email" name="email" id="contact_email" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                    <p v-if="listErrors?.includes('contact_email')" class="text-xs text-red-600 font-medium">Email is required!</p>
                  </div>

                </div>
              </div>

              <!-- Customer Info Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Customer Information</h2>
                <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 border-blue-600 border-2 p-4 rounded-lg mt-1">

                  <!-- Building Type -->
                  <div class="sm:col-span-3">
                    <label for="customer-type" class="block text-sm font-medium leading-6 text-gray-900">Building Type</label>
                    <div class="mt-2">
                      <select v-model="customerInfo.type" id="customer-type" name="customer-type" class="block py-2 px-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="home">Home</option>
                        <option value="business">Business</option>
                      </select>
                    </div>
                  </div>

                  <!-- Business Name -->
                  <div v-if="customerInfo.type == 'business'" class="sm:col-span-3">
                    <label for="bussiness-name" class="block text-sm font-medium leading-6 text-gray-900">Business name</label>
                    <div class="mt-2">
                      <input v-model="customerInfo.businessName" type="text" name="bussiness-name" id="bussiness-name" autocomplete="given-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-2" />
                    </div>
                  </div>

                </div>
              </div>

              <!-- Pickup Info Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Pickup Information</h2>
                <div class="grid grid-cols-1 gap-y-4 border-blue-600 border-2 p-4 rounded-lg mt-1">

                  <!-- Building Type -->
                  <div class="space-y-2">
                    <label for="building-type" class="block text-sm font-semibold leading-6 text-gray-900 ">Building Type</label>
                    <select v-model="movingFromInfo.buildingType" id="building-type" name="building-type" class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out hover:animation-flash sm:max-w-xs sm:text-sm sm:leading-6    px-2">
                      <option v-for="building in listBuildingType" :key="building.value" :value="building.value">{{building.name}}</option>
                    </select>
                  </div>

                  <!-- Apartment Or Condo Details -->
                  <div v-if="movingFromInfo?.buildingType == 'condo' || movingFromInfo?.buildingType == 'apartment'" class="grid grid-cols-3 gap-4">

                    <!-- Floor Number -->
                    <div class="space-y-2 col-span-3 md:col-span-1">
                      <label for="moving-from-floor-number" class="block text-xs font-semibold leading-6 text-gray-900 ">Floor Number</label>
                      <input v-model="movingFromInfo.floorNumber" type="number" id="moving-from-floor-number" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                    </div>

                    <!-- Complex -->
                    <div class="space-y-2 col-span-3 md:col-span-1">
                      <label for="moving-from-complex" class="block text-xs font-semibold leading-6 text-gray-900 ">Complex</label>
                      <input v-model="movingFromInfo.complex" type="text" id="moving-from-complex" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                    </div>

                    <!-- Unit Number or Letter -->
                    <div class="space-y-2 col-span-3 md:col-span-1">
                      <label for="moving-from-unit-number-letter" class="block text-xs font-semibold leading-6 text-gray-900 ">Unit Number or Letter</label>
                      <input v-model="movingFromInfo.unitNumberOrLetter" type="text" id="moving-from-unit-number-letter" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                    </div>

                  </div>

                  <!-- Pickup Date and Time -->
                  <div class="flex flex-row gap-2 items-center">
                    <div class="space-y-2 w-full lg:w-max">
                      <label for="pick-up-date" class="block text-sm font-semibold leading-6 text-gray-900 ">Date</label>
                      <input v-model="movingFromInfo.date" type="date" name="pick-up-date" id="pick-up-date" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                      <p v-if="listErrors?.includes('pickup_date')" class="text-xs text-red-600 font-medium">Date is required!</p>
                    </div>

                    <div class="space-y-2 w-full lg:w-max">
                      <label for="pick-up-time" class="block text-sm font-semibold leading-6 text-gray-900 ">Time</label>
                      <input v-model="movingFromInfo.time" type="time" name="pick-up-time" id="pick-up-time" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                      <p v-if="listErrors?.includes('pickup_time')" class="text-xs text-red-600 font-medium">Time is required!</p>
                    </div>

                  </div>

                  <!-- Pick up Location -->
                  <div class="space-y-2">
                    <label for="pick-up-location" class="block text-sm font-semibold leading-6 text-gray-900 ">Address</label>
                    <div class="relative">
                      <input
                        v-model="pickupLocation.formatted_address"
                        id="autocomplete"
                        type="text"
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <p v-if="pickupLocationError" class="text-xs text-red-600 font-medium">{{ pickupLocationError }}</p>
                    <p v-else-if="listErrors?.includes('pickup_location')" class="text-xs text-red-600 font-medium">Address is required!</p>
                  </div>

                </div>
              </div>

              <!-- Services -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Services</h2>
                <div class="border-blue-600 border-2 p-4 rounded-lg mt-1">

                  <div class="grid grid-cols-2 gap-4">
                    <div v-for="service in listServicesType" :key="service.value" @click="selectService(service)" :class="[selectedServicesType.find((obj)=> obj.value == service.value) ? 'border-blue-600' : 'border-gray-300 hover:border-gray-400', 'relative flex items-center space-x-3 rounded-lg border  bg-white hover:bg-gray-100 hover: px-5 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2  cursor-pointer']">

                      <div class="flex-shrink-0">
                        <img class="h-10 w-10" :src="`@/../public${service.imageUrl}`" alt="" />
                      </div>

                      <p class="grow text-sm font-medium text-gray-900 ">{{ service.name }}</p>

                      <div v-if="selectedServicesType.find((obj)=> obj.value == service.value)" class="bg-blue-600 w-5 h-5 rounded-full flex ">
                        <svg class="text-white w-4 h-4 m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>

                    </div>
                  </div>
                  <p v-if="listErrors?.includes('select_services')" class="text-xs text-red-600 font-medium mt-2">Select at least one service!</p>


                </div>
              </div>

              <!-- Destination Info Section -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Destination Information</h2>
                <div class="grid grid-cols-1 gap-x-6 gap-y-4 border-blue-600 border-2 p-4 rounded-lg mt-1">

                  <!-- Building Type -->
                  <div class="space-y-2">
                    <label for="building-type" class="block text-sm font-semibold leading-6 text-gray-900 ">Building Type</label>
                    <select v-model="movingToInfo.buildingType" id="building-type" name="building-type" class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out hover:animation-flash sm:max-w-xs sm:text-sm sm:leading-6    px-2">
                      <option v-for="building in listBuildingType" :key="building.value" :value="building.value">{{building.name}}</option>
                    </select>
                  </div>

                  <!-- Apartment Or Condo Details -->
                  <div v-if="movingToInfo?.buildingType == 'condo' || movingToInfo?.buildingType == 'apartment'" class="grid grid-cols-3 gap-4">

                    <!-- Floor Number -->
                    <div class="space-y-2 col-span-3 md:col-span-1">
                      <label for="floor-number" class="block text-xs font-semibold leading-6 text-gray-900 ">Floor Number</label>
                      <input v-model="movingToInfo.floorNumber" type="number" id="floor-number" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                    </div>

                    <!-- Complex -->
                    <div class="space-y-2 col-span-3 md:col-span-1">
                      <label for="complex" class="block text-xs font-semibold leading-6 text-gray-900 ">Complex</label>
                      <input v-model="movingToInfo.complex" type="text" id="complex" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                    </div>

                    <!-- Unit Number or Letter -->
                    <div class="space-y-2 col-span-3 md:col-span-1">
                      <label for="unit-number-letter" class="block text-xs font-semibold leading-6 text-gray-900 ">Unit Number or Letter</label>
                      <input v-model="movingToInfo.unitNumberOrLetter" type="text" id="unit-number-letter" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                    </div>

                  </div>

                  <!-- Drop-Off Location -->
                  <div class="space-y-2">
                    <label for="drop-off-location" class="block text-sm font-semibold leading-6 text-gray-900 ">Address</label>
                    <input v-model="dropOffLocation.formatted_address" type="text" name="drop-off-location" id="drop-off-location" class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "  />
                    <p v-if="listErrors?.includes('dropoff_location')" class="text-xs text-red-600 font-medium">Address is required!</p>
                  </div>

                  <!-- Additional Stops -->
                  <div id="list-stops" class="flex flex-col gap-2">
                    <label for="drop-off-location" class="block text-sm font-semibold leading-6 text-gray-900 ">Stops</label>
                    <div @click.stop="addStop()" class="text-blue-600 text-xs flex items-center gap-1 font-medium cursor-pointer">
                      <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span>Add Stop</span>
                    </div>
                    <div v-for="(stop, index) in stops" :key="index" class="flex items-center gap-2">
                      <input
                        :id="`stop-${index}`"
                        type="text"
                        :value="stop.formatted_address"
                        @input="updateStopAddress(index, $event.target.value)"
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6   "
                      />
                      <svg class="w-5 h-5 cursor-pointer text-red-500 hover:text-red-700" @click="deleteStop(index)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>

                    </div>

                  </div>

                </div>
              </div>

              <!-- Additionals -->
              <div class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Additionals</h2>
                <div class="border-blue-600 border-2 p-4 rounded-lg mt-1">

                  <label for="notes" class="block text-sm font-semibold leading-6 text-gray-900 ">Notes</label>
                  <textarea v-model="additionals.notes" id="notes" rows="6" class="resize-none block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm/6" />


                </div>
              </div>

              <!-- Payment Details -->
              <div v-if="indexReservation >= 0 && selectedReservationDetails?.payment" class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Payment Details</h2>
                <div class="border-blue-600 border-2 p-4 rounded-lg mt-1 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">

                  <div class="sm:col-span-6 flex gap-2 items-center">
                    <Switch v-model="enabledPayment" class="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                      <span class="sr-only">Use setting</span>
                      <span aria-hidden="true" class="pointer-events-none absolute h-full w-full rounded-md bg-white" />
                      <span aria-hidden="true" :class="[enabledPayment ? 'bg-blue-600' : 'bg-gray-200', 'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out']" />
                      <span aria-hidden="true" :class="[enabledPayment ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out']" />
                    </Switch>
                    <p class="text-sm font-medium text-gray-900">Enable to add payment information</p>
                  </div>

                  <!-- Moving Price  -->
                  <div v-if="enabledPayment" class="sm:col-span-3">
                    <label for="price" class="block text-sm/6 font-medium text-gray-900">Moving Price</label>
                    <div class="relative mt-2 rounded-md shadow-sm">
                      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span class="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input v-model="payment.price" type="number" min="0" id="price" class="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm/6" placeholder="0.00" aria-describedby="price-currency" />
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span class="text-gray-500 sm:text-sm" id="price-currency">USD</span>
                      </div>
                    </div>
                  </div>

                  <!-- Payement Type  -->
                  <div v-if="enabledPayment" class="sm:col-span-3">
                    <label for="payment-type" class="block text-sm font-medium leading-6 text-gray-900">Payment Type</label>
                    <div class="mt-2">
                      <select v-model="payment.type" id="payment-type" name="payment-type" class="block py-2 px-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="link">Link</option>
                      </select>
                    </div>
                  </div>

                  <!-- Payment Link  -->
                  <div v-if="enabledPayment && payment.type == 'link'" class="sm:col-span-3">
                    <label for="link" class="block text-sm/6 font-medium text-gray-900">Payment Link</label>
                    <div class="relative mt-2 rounded-md shadow-sm">
                      <input v-model="payment.link" type="text" id="link" class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm/6" />
                    </div>
                  </div>

                </div>
              </div>



              <!-- Google Map -->
              <div v-show="false" class="border-t border-gray-200 pt-4 mt-4">
                <h2 class="text-lg font-semibold text-blue-600">Google Map</h2>
                <div class="border-blue-600 border-2 p-4 rounded-lg mt-1">

                  <!-- :mapTypeControl="false" :zoomControl="false" :disableDefaultUi="false" gestureHandling="greedy" :clickableIcons="false" :fullscreenControl="false" -->
                  <GoogleMap ref="mapRef" api-key="AIzaSyAq3u_YFcwIEW76IwOzrNS0cFo-lYxAJL8" style="width: 100%; height: 500px;" :center="center" :zoom="15" :streetViewControl="false" >

                    <Marker v-if="pickupLocation.geometry" :options="markerOptions(pickupLocation.geometry.location, 'red', 'P')" />

                    <Marker v-if="stops?.length" v-for="(stop, index) in stops" :key="index" :options="markerOptions(stop?.geometry?.location, 'yellow', `S${index + 1}`, 'black')" />

                    <Marker v-if="dropOffLocation.geometry" :options="markerOptions(dropOffLocation.geometry.location, 'green', 'D')" />
                    <!-- <Marker v-if="false" :options="{ position: center,draggable: true}" @dragend="markerClick($event,true)" /> -->
                  </GoogleMap>

                  <div v-if="totalDistance" class="mt-4">
                    <p class="text-xs font-medium text-gray-900">
                      Estimated Distance:: {{ distanceText }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Reservation Date Section -->
              <div class="border-t border-gray-200 pt-6 mt-6 flex gap-2 justify-between">

                <button @click.stop="closeModalNewReservation()" class="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-max">Close</button>

                <div class="flex items-center gap-2">
                  <button @click.stop="createNewReservation()" :class="[loadingSubmitData ? 'disabled':'', 'block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600']">{{indexReservation != null && indexReservation >= 0 ? "Update" : "Create"}}</button>
                </div>
              </div>

          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- Modal Confirm Reservation -->
  <div v-if="modalConfirmReservation" @click.stop="" class="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div v-click-outside="closeModalConfirmReservation" class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">

          <div class="px-4 py-3 border-b border-gray-200 flex justify-between">
            <div class="flex flex-col gap-2 grow">
              <h2 class="text-gray-900 text-lg font-semibold">Confirm Reservation</h2>
              <p class="text-gray-500 text-sm">confirm reservation give the option to set Payment link and total price</p>
            </div>
          </div>
          <div class="px-4 py-6 max-h-[calc(100vh-200px)] overflow-auto">

              <!-- Ride Details Section -->
              <div class="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">

                <div class="sm:col-span-6 flex gap-2 items-center">
                  <Switch v-model="enabledPayment" class="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                    <span class="sr-only">Use setting</span>
                    <span aria-hidden="true" class="pointer-events-none absolute h-full w-full rounded-md bg-white" />
                    <span aria-hidden="true" :class="[enabledPayment ? 'bg-blue-600' : 'bg-gray-200', 'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out']" />
                    <span aria-hidden="true" :class="[enabledPayment ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out']" />
                  </Switch>
                  <p class="text-sm font-medium text-gray-900">Enable to add payment information</p>
                </div>

                <!-- Moving Price  -->
                <div v-if="enabledPayment" class="sm:col-span-3">
                  <label for="price" class="block text-sm/6 font-medium text-gray-900">Moving Price</label>
                  <div class="relative mt-2 rounded-md shadow-sm">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input v-model="payment.price" type="number" min="0" id="price" class="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm/6" placeholder="0.00" aria-describedby="price-currency" />
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span class="text-gray-500 sm:text-sm" id="price-currency">USD</span>
                    </div>
                  </div>
                </div>

                <!-- Payement Type  -->
                <div v-if="enabledPayment" class="sm:col-span-3">
                  <label for="payment-type" class="block text-sm font-medium leading-6 text-gray-900">Payment Type</label>
                  <div class="mt-2">
                    <select v-model="payment.type" id="payment-type" name="payment-type" class="block py-2 px-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6">
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="link">Link</option>
                    </select>
                  </div>
                </div>

                <!-- Payment Link  -->
                <div v-if="enabledPayment && payment.type == 'link'" class="sm:col-span-3">
                  <label for="link" class="block text-sm/6 font-medium text-gray-900">Payment Link</label>
                  <div class="relative mt-2 rounded-md shadow-sm">
                    <input v-model="payment.link" type="text" id="link" class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm/6" />
                  </div>
                </div>

              </div>

              <p v-if="reservationsError" class="text-red-600 text-sm mt-5">{{reservationsError}}</p>

              <!-- Reservation Date Section -->
              <div class="border-t border-gray-200 pt-6 mt-6 flex gap-2 justify-between">

                <button @click.stop="closeModalConfirmReservation()" class="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-max">Close</button>

                <div class="flex items-center gap-2">
                  <button @click.stop="changeReservationStatus('confirmed')" :class="[loadingReservationStatus || (enabledPayment && payment.price <= 0) ? 'disabled':'', 'block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600']">Confirm Reservation</button>
                </div>
              </div>

          </div>

        </div>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">

import moment from 'moment';
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useRoute } from "vue-router";

import { Switch } from '@headlessui/vue'

import { GoogleMap, Marker } from 'vue3-google-map'

let mapRef = ref(null);
let autoComplete =  ref(null);
let center = ref({"lat":52.3555177,"lng":-1.1743197});
let pickupLocation = ref({formatted_address: '', geometry: null});
const pickupLocationError = ref('');
let dropOffLocation = ref({formatted_address: '', geometry: null});
let stops = ref([]);
let directionsService = ref(null);
let directionsRenderer = ref(null);
const californiaBounds = ref(null);
const californiaComponentRestrictions = ref({ country: 'us' });
const distanceService = ref(null);
const totalDistance = ref(null);

// You can use this computed property to display the distance
const distanceText = computed(() => {
  return totalDistance.value ? `${totalDistance.value} miles` : 'Calculating...';
});

// Listen to AutoComplete
watch(() => mapRef.value?.ready, (ready) => {

  if (!ready) return
    setTimeout(()=> {
      autoComplete.value = new mapRef.value.api.places.Autocomplete(document.getElementById("autocomplete"),{
          fields: ["address_components", "geometry","place_id","name","adr_address","formatted_address"],
      });
      autoComplete.value.addListener("place_changed", getAutocompleteSelectedLocation);
    }, 1000);
});

// show location selected in autocomplete in map
function getAutocompleteSelectedLocation() {
  const place = autoComplete.value.getPlace();
  if (place.geometry) {
    // Check if the selected place is within California
    if (isPlaceInCalifornia(place)) {
      pickupLocation.value = place;
      center.value = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      pickupLocationError.value = '';
      updateMap();
    } else {
      pickupLocationError.value = 'Please select a location within California.';
      pickupLocation.value = {formatted_address: '', geometry: null};
    }
  } else {
    pickupLocationError.value = 'Please select a valid location.';
    pickupLocation.value = {formatted_address: '', geometry: null};
  }
};

// Add this new function to check if a place is within California
function isPlaceInCalifornia(place) {
  const californiaComponent = place.address_components.find(component =>
    component.short_name === 'CA' && component.types.includes('administrative_area_level_1')
  );
  return !!californiaComponent;
};

// Add a new function to handle adding stops
function addStop() {
  stops.value.push({ formatted_address: '', geometry: null });

  nextTick(() => {
    initializeStopAutocomplete(stops.value.length - 1);
  });
};

function updateStopAddress(index, value) {
  console.log("index: ", index);
  stops.value[index].formatted_address = value;
};

function deleteStop(index) {
  stops.value.splice(index, 1);
  updateMap();

  // Re-initialize autocomplete for remaining stops
  nextTick(() => {
    stops.value.forEach((_, i) => initializeStopAutocomplete(i));
  });
};

function initializeStopAutocomplete(index) {
  const stopInput = document.getElementById(`stop-${index}`);
  if (stopInput) {
    const stopAutocomplete = new mapRef.value.api.places.Autocomplete(stopInput, {
      fields: ["address_components", "geometry", "place_id", "name", "adr_address", "formatted_address"],
      bounds: californiaBounds.value,
      componentRestrictions: californiaComponentRestrictions.value,
      strictBounds: true
    });
    stopAutocomplete.addListener("place_changed", () => {
      const place = stopAutocomplete.getPlace();
      stops.value[index] = place;
      updateMap();
    });
  }
};

// Add this function to create custom marker options
function markerOptions(position, color, label, labelColor) {
  return {
    position,
    icon: {
      // url: '/logo.png',
      // scaledSize: new google.maps.Size(40, 40)
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#000',
      strokeWeight: 1,
      scale: 1,
      labelOrigin: new google.maps.Point(0, -30),
    },
    label: {
      text: label,
      color: labelColor ? labelColor : 'white',
      fontSize: '14px',
      fontWeight: 'bold'
    }
  };
};

// Add a new function to update the map
function updateMap() {
  const bounds = new mapRef.value.api.LatLngBounds();

  if (pickupLocation.value.geometry) {
    bounds.extend(pickupLocation.value.geometry.location);
  }

  stops.value.forEach(stop => {
    if (stop.geometry) {
      bounds.extend(stop.geometry.location);
    }
  });

  if (dropOffLocation.value.geometry) {
    bounds.extend(dropOffLocation.value.geometry.location);
  }

  mapRef.value.map.fitBounds(bounds);

  // Calculate and display route
  calculateAndDisplayRoute();
};

// Add this new function to calculate and display the route
function calculateAndDisplayRoute() {
  if (!directionsService.value) {
    directionsService.value = new google.maps.DirectionsService();
  }
  if (!directionsRenderer.value) {
    directionsRenderer.value = new google.maps.DirectionsRenderer({
      map: mapRef.value.map,
      suppressMarkers: true
    });
  }

  const waypoints = stops.value.map(stop => ({
    location: stop?.geometry?.location,
    stopover: true
  }));

  directionsService.value.route({
    origin: pickupLocation?.value?.geometry?.location,
    destination: dropOffLocation?.value?.geometry?.location,
    waypoints: waypoints,
    travelMode: google.maps.TravelMode.DRIVING
  }, (response, status) => {
    if (status === 'OK') {
      directionsRenderer.value.setDirections(response);
      calculateDistance(response.routes[0]);
    } else {
      console.error('Directions request failed due to ' + status);
    }
  });
};

// Add this new function to calculate distance
function calculateDistance(route) {
  let distance = 0;
  const legs = route.legs;
  for (let i = 0; i < legs.length; i++) {
    distance += legs[i].distance.value;
  }
  // Convert meters to miles
  totalDistance.value = (distance / 1609.34).toFixed(2);
};

// End Google Functions And Variables

// Routers
const route = useRoute();

// Functionalities
import useReservation from '@/helpers/useReservation.ts';
const { listReservations, createReservation, editReservationStatus, updateReservation, deleteReservation } = useReservation();

import globaleFunctions from '@/helpers/globaleFunctions.ts';
const { confirm } = globaleFunctions();

// variables About Reservation List and Loadmore
let searchText: string = ref('');
let reservations: array = ref([]);
let loadingReservations:boolean = ref(false);
let loadingLoadmoreAppointments:boolean = ref(false);
let reservationsError: string = ref(null);
let appointmentPage: number = ref(1);
let totalReservations: number = ref(0);

// variables About Modal Details
let modalDetailReservation: boolean = ref(false);
let selectedReservationDetails: object = ref(null);
let loadingReservationStatus: boolean = ref(false);
let loadingDeleteReservation: boolean = ref(false);

// Variables About Modal New and Edit Reservation
let modalNewReservation: boolean = ref(false);
let contactInfo = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
})

let customerInfo = ref({
  type: 'home',
  businessName: ""
});

const listBuildingType = computed(() => {

  if (customerInfo.value?.type == 'business') {
    return [
      {value: 'office', name: 'Office'},
      {value: 'warehouse', name: 'Warehouse'},
      {value: 'retail', name: 'Retail'},
      {value: 'storage', name: 'Storage'}
    ]
  }else{
    return [
      {value: 'house', name: 'House'},
      {value: 'condo', name: 'Condo'},
      {value: 'apartment', name: 'Apartment'},
      {value: 'storage', name: 'Storage'}
    ]
  }
})

let movingFromInfo = ref({
  buildingType: "house",
  date: null,
  time: null,
  floorNumber: 0,
  complex: "",
  unitNumberOrLetter: ""
});

let listServicesType = ref([
  {value: 'move', name: 'Help Me Move', imageUrl: '/svg/help-me-move.svg'},
  {value: 'pack', name: 'Help Me Pack', imageUrl: '/svg/help-me-pack.svg'},
  {value: 'junk_removal', name: 'Junk Removal', imageUrl: '/svg/junk-removal.svg'},
  {value: 'rearranging_space', name: "I'm Rearranging My Space", imageUrl: '/svg/rearranging-space.svg'},
  {value: 'storage_service', name: 'I Need Storage Services', imageUrl: '/svg/need-storage.svg'}
])
let selectedServicesType = ref([]);

let movingToInfo = ref({
  buildingType: "house",
  floorNumber: 0,
  complex: "",
  unitNumberOrLetter: ""
});

let additionals = ref({
  notes: ""
});

let enabledPayment = ref(true);
let payment = ref({
  price: 0,
  type: "cash",
  link: ""
});

let listErrors = ref([]);
let loadingSubmitData = ref(false);
let indexReservation: number = ref(null);

// variables About Modal Confirm Reservation
let modalConfirmReservation: boolean = ref(false);

// Functions About Reservation List and Loadmore
async function getReservations(){

  appointmentPage.value = 1;
  try {
    loadingReservations.value = true;

    const getAppointments = await listReservations(appointmentPage.value, searchText.value);
    console.log("getAppointments: ", getAppointments);
    if (getAppointments?.data?.reservations) {
      reservations.value = getAppointments.data.reservations;

      if (route?.query?.reservation_id) {
        let exist = reservations.value?.findIndex((obj)=> obj?._id == route?.query?.reservation_id);
        if (exist >= 0) {
          openModalDetails(reservations.value[exist]);

        }
      }

      totalReservations.value = getAppointments?.data?.total
    }

    if (reservations?.value?.length < getAppointments?.data?.total) {
      appointmentPage.value++;
    }else{
      appointmentPage.value = null;
    }

    if (getAppointments?.response?.status > 201) {
      reservationsError.value = getAppointments.response.data.message || "Something went wrong, Please try again"
    }

    loadingReservations.value = false;
  } catch (error) {
    console.log("error: ", error);
    reservationsError.value = error?.response?.data?.message ? error.response.data.message : error;
  }

};
async function loadMoreReservations(){

  try {
    loadingLoadmoreAppointments.value = true;

    const getAppointments = await listReservations(appointmentPage.value, searchText.value);

    if (getAppointments?.data?.reservations?.length) {
      reservations.value = [...reservations.value ,...getAppointments.data.reservations];
      totalReservations.value = getAppointments.data.total
      appointmentPage.value++;
    }


    if (getAppointments?.response?.status > 201) {
      reservationsError.value = getAppointments.response.data.message || "Something went wrong, Please try again"
    }

    loadingLoadmoreAppointments.value = false;
  } catch (error) {
    console.log("error: ", error);
    reservationsError.value = error?.response?.data?.message ? error.response.data.message : error;
  }

};

// Functions About Modal Details
function openModalDetails(reservation){
  indexReservation.value = null;
  modalDetailReservation.value = true;
  selectedReservationDetails.value = reservation;
};
function closeModalDetails(){
  modalDetailReservation.value = false;
  selectedReservationDetails.value = null;
};
async function changeReservationStatus(status){

  loadingReservationStatus.value = true;

  try {

    let extraData = enabledPayment.value ? {
      price: payment.value?.price,
      type: payment.value?.type,
      link: payment.value?.link
    } : null;
    console.log("extraData: ", extraData)
    const reservationStatus = await editReservationStatus(selectedReservationDetails?.value?._id, status, status == 'confirmed' && enabledPayment.value ? extraData : null);

    if (reservationStatus?.data?._id) {
      selectedReservationDetails.value = reservationStatus.data;
      let reservationindex = reservations.value.findIndex((obj)=> obj?._id == reservationStatus.data._id);
      console.log("reservationindex: ", reservationindex)
      if (reservationindex >= 0) {
        reservations.value[reservationindex] = reservationStatus.data
      }
      payment.value = {
        price: 0,
        type: "cash",
        link: ""
      };
      closeModalConfirmReservation();
    }

    if (reservationStatus?.response?.status > 201) {
      reservationsError.value = reservationStatus.response.data.message || "Something went wrong, Please try again"
    }

  } catch (error) {
    console.log("error: ", error);
    reservationsError.value = error.response.data.message || "Something went wrong, Please try again"
  }

  loadingReservationStatus.value = false;
};
function confirmDeleteReservation(){
  confirm("error", "Are you sure you want to delete this reservation?", async () => {

    loadingDeleteReservation.value = true;
    try {

      const reservation = await deleteReservation(selectedReservationDetails?.value?._id);
      console.log("reservation: ", reservation)
      if (reservation?.data?.message == "RESERVATION_DELETED") {

        modalDetailReservation.value = false;
        let indexDeletedReservation = reservations.value.findIndex((obj)=> obj?._id == selectedReservationDetails?.value?._id);
        reservations.value.splice(indexDeletedReservation, 1);
        totalReservations.value = totalReservations.value - 1;
        selectedReservationDetails.value = null;

      }
    } catch (error) {
      console.log("error: ", error);
    }
    loadingDeleteReservation.value = false;
  });
};

// Functions About Modal Confirm Reservation
function openModalConfirmReservation(){
  modalConfirmReservation.value = true;
};
function closeModalConfirmReservation(){
  modalConfirmReservation.value = false;
};

// Functions About New and Edit Reservation
function selectService(service){

  let existIndex = selectedServicesType.value.findIndex((obj)=> obj.value == service.value);

  if (existIndex >= 0) {
    selectedServicesType.value.splice(existIndex, 1);
  }else{
    selectedServicesType.value.push(service);
  }
};
function openModalNewReservation(reservation){
  modalNewReservation.value = true;
};
function closeModalNewReservation(){
  modalNewReservation.value = false;
  indexReservation.value = null;
};
async function createNewReservation(){

  listErrors.value = [];

  if (!contactInfo?.value?.firstName?.trim()?.length) {
    listErrors.value.push("contact_first_name");
  }
  if (!contactInfo?.value?.lastName?.trim()?.length) {
    listErrors.value.push("contact_last_name");
  }
  if (!contactInfo?.value?.email?.trim()?.length) {
    listErrors.value.push("contact_email");
  }
  if (!contactInfo?.value?.phone?.trim()?.length) {
    listErrors.value.push("contact_phone");
  }
  if (customerInfo?.value?.type == 'business' && !customerInfo?.value?.businessName?.trim()?.length) {
    listErrors.value.push("business_name");
  }
  if (!movingFromInfo?.value?.date) {
    listErrors.value.push("pickup_date");
  }
  if (!movingFromInfo?.value?.time) {
    listErrors.value.push("pickup_time");
  }
  if (!pickupLocation?.value?.formatted_address?.trim()?.length) {
    listErrors.value.push("pickup_location");
  }
  if (!selectedServicesType.value.length) {
    listErrors.value.push("select_services");
  }
  if (!dropOffLocation?.value?.formatted_address?.trim()?.length) {
    listErrors.value.push("dropoff_location");
  }


  if (listErrors.value?.length) {
    console.log("listErrors.value: ", listErrors.value);
    return
  }

  loadingSubmitData.value = true;

  let listStops = [];
  if (stops?.value?.length) {
    stops.value.map((stop)=>{
      listStops.push({formatted_address: stop?.formatted_address, geometry: stop?.geometry});
    })
  }

  let finalPickUpInfo = movingFromInfo.value;
  let finalDestinationInfo = movingToInfo.value;
  finalPickUpInfo.address = {formatted_address: pickupLocation.value.formatted_address, geometry: pickupLocation.value.geometry}
  finalDestinationInfo.address = {formatted_address: dropOffLocation.value.formatted_address, geometry: dropOffLocation.value.geometry}
  finalDestinationInfo.stops = listStops;

  let finalObject = {
    "contactInfo": contactInfo.value,
    "customerInfo": customerInfo.value,
    "pickupInfo": finalPickUpInfo,
    "selectedServicesType": selectedServicesType.value,
    "destinationInfo": finalDestinationInfo,
    "additionals": additionals.value
  }

  if (!indexReservation.value) {
    finalObject.status = "pending";
  }
  if (indexReservation.value >= 0 && payment.value?.price) {
    finalObject.payment = payment.value;
  }

  console.log("finalObject: ", finalObject);
  // loadingSubmitData.value = false;
  // return
  try {

    const resr = indexReservation.value >= 0 ? await updateReservation(reservations.value[indexReservation.value]?._id ,finalObject) : await createReservation(finalObject);
    if (resr?.data?._id) {
      if (indexReservation.value >= 0) {
        reservations.value[indexReservation.value] = resr.data;
      }else{
        reservations.value.unshift(resr.data);
      }
      closeModalNewReservation();
      contactInfo.value = {
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
      };
      customerInfo.value = {
        type: 'home',
        businessName: ""
      };
      movingFromInfo.value = {
        buildingType: "house",
        date: null,
        time: null,
        floorNumber: 0,
        complex: "",
        unitNumberOrLetter: ""
      };
      selectedServicesType.value = [];
      movingToInfo.value = {
        buildingType: "house",
        floorNumber: 0,
        complex: "",
        unitNumberOrLetter: ""
      };
      additionals.value = {
        notes: ""
      };
      payment.value = {
        price: 0,
        type: "cash",
        link: ""
      };
      listErrors.value = [];
      loadingSubmitData.value = false;
      indexReservation.value = null;
    };

  } catch (error) {
    console.log("error: ", error);
  }
  loadingSubmitData.value = false;

};
function editReservation(){

  if (selectedReservationDetails?.value) {

    indexReservation.value = reservations.value.findIndex((obj)=> obj?._id == selectedReservationDetails?.value?._id);
    if (indexReservation.value >= 0) {

      console.log("selectedReservationDetails: ", selectedReservationDetails.value);

      contactInfo.value = JSON.parse(JSON.stringify(selectedReservationDetails.value.contactInfo));
      customerInfo.value = JSON.parse(JSON.stringify(selectedReservationDetails.value.customerInfo));
      movingFromInfo.value = JSON.parse(JSON.stringify(selectedReservationDetails.value.pickupInfo));
      pickupLocation.value = JSON.parse(JSON.stringify(selectedReservationDetails.value.pickupInfo.address));
      selectedServicesType.value = JSON.parse(JSON.stringify(selectedReservationDetails.value.selectedServicesType));
      movingToInfo.value = JSON.parse(JSON.stringify(selectedReservationDetails.value.destinationInfo));
      dropOffLocation.value = JSON.parse(JSON.stringify(selectedReservationDetails.value.destinationInfo.address));
      additionals.value = JSON.parse(JSON.stringify(selectedReservationDetails.value.additionals));

      if (selectedReservationDetails.value.payment) {
        payment.value = JSON.parse(JSON.stringify(selectedReservationDetails.value.payment))
      }

      modalNewReservation.value = true;
      modalDetailReservation.value = false;


    }
  }
};


// Global Functions
function humanize(str) {
  return str
    ?.replace(/_/g, ' ') // Replace underscores with spaces
    ?.toLowerCase() // Convert the entire string to lowercase
    ?.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};
function formatPhone() {
  // Remove all non-digit characters
  let number = contactInfo.value.phone;

  const cleaned = ('' + number).replace(/\D/g, '');

  // Check for US phone number length (10 digits) or country code +1 (11 digits)
  const isValidUSNumber = cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));

  if (isValidUSNumber) {
    // Remove the leading '1' if it's there for consistent formatting
    const numberToFormat = cleaned.length === 11 ? cleaned.slice(1) : cleaned;

    // Format the 10-digit number into (123) 456-7890
    const match = numberToFormat.match(/^(\d{3})(\d{3})(\d{4})$/);
    contactInfo.value.phone = `+1 (${match[1]}) ${match[2]}-${match[3]}`;
  }
}
// Hooks
onMounted(()=>{
  getReservations();

  watch(() => mapRef.value?.ready, (ready) => {
    if (!ready) return;
    setTimeout(() => {
      // Set up California bounds
      californiaBounds.value = new google.maps.LatLngBounds(
        new google.maps.LatLng(32.528832, -124.482003),
        new google.maps.LatLng(42.009517, -114.131211)
      );

      // Initialize all autocompletes
      initializeAutocompletes();

      // Initialize DirectionsService and DirectionsRenderer
      directionsService.value = new google.maps.DirectionsService();
      directionsRenderer.value = new google.maps.DirectionsRenderer({
        map: mapRef.value.map,
        suppressMarkers: true
      });

      // Initialize Distance Matrix Service
      distanceService.value = new google.maps.DistanceMatrixService();
    }, 1000);
  });
})

// Update the initialization functions
function initializeAutocompletes() {
  if (!mapRef.value?.api) return;

  // Initialize pickup location autocomplete
  const pickupInput = document.getElementById("autocomplete");
  if (pickupInput) {
    autoComplete.value = new mapRef.value.api.places.Autocomplete(pickupInput, {
      fields: ["address_components", "geometry", "place_id", "name", "adr_address", "formatted_address"],
      bounds: californiaBounds.value,
      componentRestrictions: californiaComponentRestrictions.value,
      strictBounds: true
    });
    autoComplete.value.addListener("place_changed", getAutocompleteSelectedLocation);
  }

  // Initialize drop-off location autocomplete
  const dropOffInput = document.getElementById("drop-off-location");
  if (dropOffInput) {
    const dropOffAutocomplete = new mapRef.value.api.places.Autocomplete(dropOffInput, {
      fields: ["address_components", "geometry", "place_id", "name", "adr_address", "formatted_address"],
      bounds: californiaBounds.value,
      componentRestrictions: californiaComponentRestrictions.value,
      strictBounds: true
    });
    dropOffAutocomplete.addListener("place_changed", () => {
      const place = dropOffAutocomplete.getPlace();
      dropOffLocation.value = place;
      updateMap();
    });
  }

  // Initialize existing stops
  stops.value.forEach((_, index) => initializeStopAutocomplete(index));
}

</script>
<!-- Add this to your <style> section -->
<style>
  .modal-content {
    position: relative;
    z-index: 9999;
  }

  /* This ensures the autocomplete appears above everything */
  .pac-container {
    z-index: 10000 !important;
    position: fixed !important;
  }
</style>