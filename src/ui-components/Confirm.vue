<template>
    <div id="confirm">
        <teleport to="body">
            <template>
                <TransitionRoot as="div" :show="user.isConfirm">
                    <!-- @close="closeModalProductInfo" -->
                    <Dialog as="div" class="relative z-[1000000]">
                        <TransitionChild as="div" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                            <div class="fixed inset-0 bg-gray-1000 bg-opacity-75 transition-opacity" />
                        </TransitionChild>

                        <div class="fixed z-10 inset-0 overflow-y-auto bg-gray-800/80">
                            <!-- items-end sm:items-center -->
                            <div class="flex justify-center min-h-full p-4 text-center max-h-screen h-max items-end sm:items-center md:w-full md:max-w-lg md:mx-auto">
                                <TransitionChild as="div" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" class="w-full">
                                    <DialogPanel class="flex relative bg-white pb-4 rounded-lg text-left overflow-hidden shadow-xl transform transition-all h-max w-full">

                                        <div class="flex flex-col w-full">
                                            <div class="flex p-5 flex-col w-full items-start">
                                                <p class="text-lg font-semibold text-gray-1000 leading-[22px] mb-2 text-left">{{user?.confirmOptions?.title ? user.confirmOptions.title : "Confirm"}}</p>
                                                <p class="text-[15px] font-normal text-gray-600 leading-[150%] text-left">{{user.confirmOptions.message ? user.confirmOptions.message : "Are you sure you want to continue?"}}</p>
                                            </div>
                                            <div class="flex mt-2 space-x-2.5 self-end px-5">
                                                <button v-if="user?.confirmOptions?.hasCancel" data-test="cancel-confirmation" @click.stop="cancelConfirm" class="px-3 py-1 text-sm font-semibold text-center text-white bg-gray-600 rounded-md shadow-sm lg:block hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Cancel</button>
                                                <button :class="user?.confirmOptions?.type == 'error' ? 'text-white bg-red-500 hover:bg-red-600' : 'text-white bg-blue-600 hover:bg-blue-700'" data-test="accept-confirmation" @click.stop="submitConfirm($event)" class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold rounded-md shadow-sm sm:w-auto">{{user?.confirmOptions?.button ? user.confirmOptions.button : "Delete"}}</button>
                                            </div>
                                        </div>

                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </Dialog>
                </TransitionRoot>
            </template>

        </teleport>
    </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { userStore } from "@/stores/User";
import { ref,onMounted,onUnmounted } from "vue";

const user = userStore();

const eventListenerFunc:any = ref(null)
const checkBoxValue:any = ref(false)

onMounted(() => {
  eventListenerFunc.value = (event:any)=>{eventListenerFunction(event)}
  window.addEventListener("keypress",eventListenerFunc.value)
})

onUnmounted(() => {
  window.removeEventListener("keypress",eventListenerFunc.value)
})



function eventListenerFunction(ev:any){
  if(ev.key === 'Enter') {
      submitConfirmEnter(ev)
  }
}

function submitConfirmEnter(event:any){
  event.preventDefault()
  event.stopPropagation()
  acceptConfirm()
}

function submitConfirm(event:any){
  event.preventDefault()
  event.stopPropagation()
  acceptConfirm()
}

function acceptConfirm(){
  if (checkBoxValue.value && user.confirmOptions.hasCheckbox) {
      user.confirmOptions.callback(checkBoxValue.value);
  }else{
      user.confirmOptions.callback();
  }
  // this.executeFunc(user.confirmOptions.callback(checkBoxValue.value?checkBoxValue.value:null))
  user.isConfirm = false
}

function cancelConfirm(){
  user.isConfirm = false
  user.confirmOptions.type = null
  user.confirmOptions.message = null
  user.confirmOptions.callback = null
  // window.removeEventListener("keypress",this.eventListenerFunction(event))
}

function executeFunc(callback:any){
  callback()
}
</script>
