<template>
    <Switch v-if="isChangeable" v-model="enabled" :class="[enabled && color == 'blue' ? 'bg-blue-600' : enabled && color == 'red' ? 'bg-red-600' : enabled && color == 'green' ? 'bg-green-600' : enabled && color == 'yellow' ? 'bg-yellow-600' : enabled && color == 'dark' ? 'bg-gray-600' : 'bg-gray-500', 'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none',containerStyle]">
      <span aria-hidden="true" :class="[enabled ? 'translate-x-full' : 'translate-x-0', 'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',toggleStyle]" />
    </Switch>
    <Switch v-else :model-value="modelValue" :class="[modelValue && color == 'blue' ? 'bg-blue-600' : modelValue && color == 'red' ? 'bg-red-600' : modelValue && color == 'green' ? 'bg-green-600' : modelValue && color == 'yellow' ? 'bg-yellow-600' : modelValue && color == 'dark' ? 'bg-gray-600' : 'bg-gray-500', 'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none',containerStyle]">
      <span aria-hidden="true" :class="[modelValue ? 'translate-x-full' : 'translate-x-0', 'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',toggleStyle]" />
    </Switch>
  </template>

  <script setup lang="ts">

  import { ref, watch } from 'vue'
  import { Switch } from '@headlessui/vue'

  const props = defineProps({
    color: {
      type: String,
      default:"green"
    },
    modelValue:{
      type: Boolean,
    },
    isChangeable:{
      type: Boolean,
      default: true
    },
    containerStyle:{
      type: String,
      default:"h-6 w-11"
    },
    toggleStyle:{
      type: String,
      default:"h-5 w-5"
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const enabled: boolean = ref(props.modelValue ? true : false);

  watch(()=> props.modelValue, ()=>{
    if(props.isChangeable){
      enabled.value = props.modelValue;
      emit('update:modelValue', enabled.value);
    }
  })

  watch(enabled, ()=>{
    emit('update:modelValue', enabled.value);
  })
  watch(()=>props.modelValue, ()=>{
    enabled.value = props.modelValue ? true : false;
    emit('update:modelValue', enabled.value);
  })

  </script>