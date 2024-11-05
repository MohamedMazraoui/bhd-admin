<template>
  <Menu v-slot="{ open }" as="div"  :class="[fullWidth ? 'w-full' : '' ,'relative text-left']">
    <div v-click-outside="hideMenu">
      <div>
        <MenuButton v-if="!loading" @click.stop="dropdownButton()" :class="[fullWidth ? 'w-full' : '' ,isFlat?'':'rounded-md border shadow-sm px-4 bg-white hover:bg-gray-100 focus:outline-none border-blue-500','flex py-2 text-sm font-medium truncate ... self-center']" >

          <p v-if="selectedOption" class="self-center w-full text-left truncate ...">{{customText ? customText : selectedOption.name}}</p>
          <p v-else class="self-center w-full text-left truncate ...">No Data Selected</p>

          <ChevronDownIcon v-if="dropdownIcon" class="-mr-1 ml-2 w-5 self-center"></ChevronDownIcon>

        </MenuButton>

        <MenuButton  v-else :class="[fullWidth ? 'w-full' : '' ,isFlat?'':'rounded-md border shadow-sm px-4 bg-white hover:bg-blue-100 focus:outline-none min-h-[45px]', 'flex py-2 text-sm font-medium']" >
          <svg class="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="font-semibold text-white">Loading ...</span>
        </MenuButton>
      </div>

      <transition

        v-show="openMenu"
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
          <MenuItems v-if="!customMenu && !loading" :static="openMenu"  :unmount="true" :class="[fullWidth ? 'w-full' : 'w-max' ,'origin-top-left absolute border z-30 left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none']" >
            <div v-if="inputSearch" :class="[list && list.length > 0 ? 'border-b' : '', 'p-2']">
              <input ref="search" v-model="textSearch" @keydown="checkInput($event)" type="text" class="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-blue-400 focus:border-blue-300 sm:text-sm border" placeholder="Search" />
            </div>
            <div class="max-h-80 overflow-y-auto p-3 text-center" v-if="dropDownLoading">
              <svg class="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="font-semibold text-white">Loading ...</span>
            </div>
            <div class="max-h-72 overflow-y-auto" v-if="!dropDownLoading && list && list.length > 0">
              <MenuItem v-for="(option,index) in list" :key="index" @click.stop="selectOption(option)" :class="['border-b cursor-pointer last:border-b-0 truncate ...']" v-slot="{ active }">
                <div :class="[active ? 'bg-blue-50 first:rounded-t-md last:rounded-b-md' : '','px-4 py-2 text-sm flex']" >

                  <!-- <div v-if="withImg && option" :class="[`mr-2 self-center w-7 rounded-full bg-blue-400 bg-cover bg-no-repeat bg-center shrink-0`]" :style="`background-image: url('${option.url}')`">
                    <img class="w-full h-full" src="../../public/images/1px.png" />
                  </div> -->
                  <span class="self-center truncate ..." >{{option.name}}</span>

                </div>
              </MenuItem>
            </div>
            <div class="max-h-80 overflow-y-auto" v-else-if="!dropDownLoading && list && list.length == 0">
              <MenuItem class="">
                <div :class="['px-4 py-2 text-sm text-center']" >
                  <span class="self-center">No Results</span>
                </div>
              </MenuItem>
            </div>
          </MenuItems>
          <MenuItems v-else-if="customMenu" :static="openMenu" :class="[fullWidth ? 'w-full' : '' ,'overflow-hidden origin-top-left absolute border z-10 left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none w-max']" >
            <slot />
          </MenuItems>

      </transition>
    </div>
  </Menu>
</template>

<script setup lang="ts">

import { ref, watch } from "vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from '@heroicons/vue/20/solid';


const props = defineProps({
  list: {
    type: Array,
    default: []
  },
  customText: {
    type: String,
    default: null
  },
  fullWidth: Boolean,
  withImg: Boolean,
  loading: Boolean,
  value: {
    type: Object,
    default: null
  },
  defaultText: String,
  isFlat: {
    type: Boolean,
    default: false
  },
  dropdownIcon: {
    type: Boolean,
    default: true
  },
  customMenu: {
    type: Boolean,
    default: false
  },
  inputSearch: {
    type: Boolean,
    default: false,
  },
  isInitialValueFromList: {
    type: Boolean,
    default: true,
  },
  dropDownLoading: Boolean,
})

const emit = defineEmits(["change", "search"]);

let openMenu: boolean = ref(false);

function hideMenu() {
  openMenu.value = false
}
let selectedOption = ref(props.value ? props.value : null); //props.list[0] ||
let textSearch: string = ref("");

watch(textSearch, ()=>{
  clearTimeout(window.myTimeout);
  let timeout: number = ref(1000);
  window.myTimeout = setTimeout(() => {
    emit('search', textSearch.value);
  }, timeout.value);
})

selectedOption.value = props?.list?.length && selectedOption.value ? selectedOption.value : props.list && props.list.length ? props.list[0] : null;

watch(()=> props.list, (newList, oldList)=>{

  let isTheSame: boolean = JSON.stringify(newList) == JSON.stringify(oldList) ? true : false;
  if (!newList.length) {
    selectedOption.value = null;
    if (props.isInitialValueFromList) {
      emit('change', selectedOption.value);
    }
  }else if (newList && newList.length && (!isTheSame || !selectedOption.value)) {
    if (props.value) {
      let exist = newList.find((obj)=> JSON.stringify(obj) == JSON.stringify(props.value))
      if (exist) {
        selectedOption.value = exist;
      }else{
        selectedOption.value = newList[0];
      }
    }else{
      selectedOption.value = newList[0];
    }
    if (props.isInitialValueFromList) {
      emit('change', selectedOption.value);
    }
  }
})

watch(()=> props.value, (newValue, oldValue)=>{

  let isTheSame: boolean = JSON.stringify(newValue) == JSON.stringify(oldValue) ? true : false;
  if (newValue && (!isTheSame || !selectedOption.value)) {
    selectedOption.value = newValue;
    emit('change', selectedOption.value);
  }
})

function checkInput(e){
  if (e.code === "Space") { // || e.code === "Enter"
    e.stopPropagation();
  }
}

function selectOption(option) {
  selectedOption.value = option;
  openMenu.value = false;
  emit('change', option);
}

function dropdownButton(){
  openMenu.value = !openMenu.value;
}

</script>
