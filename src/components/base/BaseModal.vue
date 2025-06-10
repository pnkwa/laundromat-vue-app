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
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="receipt-modal">
          <div class="receipt-header">
            <div class="receipt-title">
              <h3 class="text-xl font-bold">{{ BaseModalprops.header ?? 'Receipt' }}</h3>
              <div class="receipt-date">{{ new Date().toLocaleDateString() }}</div>
            </div>
            <button @click="closeModal" type="button" class="close-btn">
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

          <div class="receipt-content">
            <slot></slot>
          </div>

          <div class="receipt-footer">
            <div class="receipt-line"></div>
            <div class="receipt-thank-you">Thank you for using CuCuWash!</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.receipt-modal {
  background: #fff;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }

  .receipt-header {
    padding: 1.5rem;
    border-bottom: 1px dashed #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .receipt-title {
      h3 {
        color: #1f2937;
        margin-bottom: 0.5rem;
      }

      .receipt-date {
        font-size: 0.875rem;
        color: #6b7280;
      }
    }

    .close-btn {
      color: #9ca3af;
      background: transparent;
      border: none;
      padding: 0.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        color: #4b5563;
      }
    }
  }

  .receipt-content {
    padding: 1.5rem;
    background: #fafafa;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0.75rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: repeating-linear-gradient(
        to bottom,
        #e5e7eb,
        #e5e7eb 1px,
        transparent 1px,
        transparent 8px
      );
    }
  }

  .receipt-footer {
    padding: 1.5rem;
    text-align: center;
    background: #fff;

    .receipt-line {
      height: 1px;
      background: repeating-linear-gradient(
        to right,
        #000,
        #000 1px,
        transparent 1px,
        transparent 4px
      );
      margin-bottom: 1rem;
    }

    .receipt-thank-you {
      color: #4b5563;
      font-size: 0.875rem;
      font-style: italic;
    }
  }
}
</style>
