<script lang="ts" setup>
import { onMounted, defineEmits, defineExpose, watch } from 'vue'
import { Modal, type ModalInterface, type ModalOptions, type InstanceOptions } from 'flowbite'

const BaseModalprops = defineProps<{
  isOpen: boolean
  header?: string
  leftButton?: string
  rightButton?: string
}>()

const emit = defineEmits(['update:isOpen'])

let modal: ModalInterface | undefined = undefined

function openModal() {
  modal?.show()
}
function closeModal() {
  modal?.hide()
}

onMounted(() => {
  const $modalElement = document.querySelector('#static-modal') as HTMLElement

  if ($modalElement) {
    const modalOptions: ModalOptions = {
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
      onHide: () => {
        emit('update:isOpen', false)
      },
      onShow: () => {
        emit('update:isOpen', true)
      },
    }

    const instanceOptions: InstanceOptions = {
      id: 'static-modal',
      override: true,
    }

    modal = new Modal($modalElement, modalOptions, instanceOptions)

    if (BaseModalprops.isOpen) {
      openModal()
    }
  }
})

watch(
  () => BaseModalprops.isOpen,
  (showVal) => {
    if (showVal) openModal()
    else closeModal()
  },
)

defineExpose({ openModal, closeModal })
</script>

<template>
  <div>
    <div
      id="static-modal"
      data-modal-backdrop="static"
      tabindex="-1"
      aria-hidden="true"
      class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative p-4 w-full max-w-2xl max-h-full">
        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ BaseModalprops.header ?? 'Modal Title' }}
            </h3>
            <button
              @click="closeModal"
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                class="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>

          <div class="p-4 md:p-5 space-y-4">
            <slot />
          </div>

          <div
            v-if="BaseModalprops.leftButton || BaseModalprops.rightButton"
            class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 justify-end"
          >
            <button
              @click="closeModal"
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {{ BaseModalprops.leftButton ?? 'Cancel' }}
            </button>
            <button
              @click="closeModal"
              type="button"
              class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              {{ BaseModalprops.rightButton ?? 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
