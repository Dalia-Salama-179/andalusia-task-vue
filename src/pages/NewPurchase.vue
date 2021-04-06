<template>
    <div class="new-purchase">
        <!-- breadcrumb -->
        <breadcrumb>
            <li>
                <router-link to="/">{{$t('inventory')}}</router-link>
            </li>
            <li>
                <router-link to="/">{{$t('inventoryOperations')}}</router-link>
            </li>
            <li>
                <router-link to="/">{{$t('requisitionList')}}</router-link>
            </li>
            <li><span>{{$t('newRequisition')}}</span></li>
        </breadcrumb>

        <!-- page title -->
        <h2 class="page-title">{{$t($route.name)}}</h2>

        <div>
            <form>
                <div class="page-content">

                    <div class="sub-data-title">
                        <svg>
                            <use xlink:href="@/assets/images/sprite.svg#info"></use>
                        </svg>
                        {{$t('basicInfo')}}
                    </div>
                    <div class="basic-info">
                        <!-- PR code -->
                        <div>
                            <label>{{$t('PRCode')}}</label>
                            <k-input disabled="disabled" :placeholder="$t('PRAuto')"></k-input>
                        </div>

                        <!-- warehouse -->
                        <div>
                            <label>{{$t('warehouse')}} <span>*</span></label>
                            <dropdownlist
                                    :data-items='warehouses'
                                    :text-field="'name'"
                                    :data-item-key="'id'"
                                    :value="value"
                                    @change="warehouseSelected"
                            >
                            </dropdownlist>

                            <!-- drafts -->
                            <div class="drafts" v-if="drafts.length > 0">
                                <p class="text-danger">This warehouse already has other drafts</p>
                                <div>
                                    <a href="#" @click.prevent.stop="showDraft = !showDraft">
                                        <svg>
                                            <use xlink:href="@/assets/images/sprite.svg#exclamation-mark"></use>
                                        </svg>
                                    </a>
                                    <ul :class="{'d-block': showDraft}">
                                        <li v-for="(draft, index) in drafts" :key="index">{{ draft }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- preferred delivery date -->
                        <div>
                            <label>{{$t('deliveryDate')}} <span>*</span></label>
                            <datepicker
                                    :min="new Date()"
                                    :default-value="new Date()"
                                    :format="'dd/MM/yyyy'"
                                    v-model="form.date"
                            ></datepicker>
                        </div>
                    </div>

                    <div class="sub-data-title">
                        <svg>
                            <use xlink:href="@/assets/images/sprite.svg#details"></use>
                        </svg>
                        {{$t('productDetails')}}
                    </div>

                    <custom-grid :warehouse="form.warehouse"
                                 @addingProduct="addingProduct"
                                 @productAdded="productAdded = true"></custom-grid>

                    <!-- warehouse notes -->
                    <div>
                        <label>{{$t('warehouseNotes')}}</label>
                        <textarea cols="30" rows="6" :placeholder="$t('writeWarehouseNotes')"
                                  v-model="form.notes"></textarea>
                    </div>
                </div>
                <div class="buttons-wrapper">
                    <button class="k-button save-send">{{$t('saveSend')}}</button>
                    <button class="k-button save">{{$t('save')}}</button>
                    <button class="k-button k-text-primary">{{$t('cancel')}}</button>
                </div>
            </form>
        </div>

        <!-- dialog showed when we change warehouse -->
        <k-dialog v-if="visibleDialog" :title="'Please confirm'" @close="toggleDialog">
            <p :style="{ margin: '25px', textAlign: 'center' }">The added products lines will be removed as you will
                change the warehouse, Are you sure you want to change?</p>
            <dialog-actions-bar>
                <button class="k-button" @click='toggleDialog'>No</button>
                <button class="k-button" @click='approveChanges'>Yes</button>
            </dialog-actions-bar>
        </k-dialog>
    </div>
</template>

<script>
    import {DropDownList} from '@progress/kendo-vue-dropdowns';
    import {Input} from '@progress/kendo-vue-inputs';
    import {DatePicker} from '@progress/kendo-vue-dateinputs';
    import Breadcrumb from "../components/Breadcrumb";
    import Vue from 'vue'
    import Grid from "../components/NewPurchase/Grid";
    import {Dialog, DialogActionsBar} from '@progress/kendo-vue-dialogs';

    export default {
        name: "NewPurchase",
        components: {
            Breadcrumb,
            'dropdownlist': DropDownList,
            'k-input': Input,
            'datepicker': DatePicker,
            'custom-grid': Grid,
            'k-dialog': Dialog,
            'dialog-actions-bar': DialogActionsBar

        },
        data() {
            return {
                visibleDialog: false,
                value: {id: 0, name: 'Select Deliver to Whom ...'},
                form: {
                    date: new Date()
                },
                warehouses: [
                    {id: 1, name: 'Warehouse 1'},
                    {id: 2, name: 'Warehouse 2', drafts: ['PR00012', 'PR00013', 'PR00014', 'PR00015']},
                    {id: 3, name: 'Warehouse 3', drafts: ['PR00016', 'PR00017', 'PR00018', 'PR00020']},
                    {id: 4, name: 'Warehouse 4'},
                    {id: 5, name: 'Warehouse 5', drafts: ['PR00022', 'PR00034', 'PR00044', 'PR00035']},
                    {id: 6, name: 'Warehouse 6'},
                ],
                drafts: [],
                showDraft: false,
                productInAction: null,
                warehouseBackup: {},
                productAdded: false
            }
        },
        computed: {},
        methods: {
            /**
             * Method invoked when we change warehouse and w already added products
             */
            toggleDialog() {
                this.visibleDialog = !this.visibleDialog;
            },

            /**
             * Method invoked when we select warehouse
             * @param {event} event
             */
            warehouseSelected(event) {
                if (!this.productInAction && !this.productAdded) {
                    Vue.set(this.value, 'id', event.value.id);
                    Vue.set(this.value, 'name', event.value.name);
                    Vue.set(this.form, 'warehouse', event.value.id);
                    this.showDraft = false;
                    if (Object.hasOwnProperty.call(event.value, 'drafts')) {
                        this.drafts = event.value.drafts;
                    } else this.drafts = [];
                } else {
                    this.toggleDialog();
                    Vue.set(this.warehouseBackup, 'id', event.value.id);
                    Vue.set(this.warehouseBackup, 'name', event.value.name);
                    if (event.value.drafts) Vue.set(this.warehouseBackup, 'drafts', event.value.drafts);
                }
            },

            /**
             * Method that invoked when we click add product button
             * @param {number} payload
             */
            addingProduct(payload) {
                this.productInAction = payload
            },

            /**
             * Method invoked when we click ok in the dialog
             */
            approveChanges() {
                this.value = {...this.warehouseBackup};
                Vue.set(this.form, 'warehouse', this.warehouseBackup.id);
                this.showDraft = false;
                if (Object.hasOwnProperty.call(this.warehouseBackup, 'drafts')) {
                    this.drafts = this.warehouseBackup.drafts;
                } else this.drafts = [];

                this.productAdded = false;
                this.toggleDialog();
            }
        }
    }

</script>

<style scoped>

</style>