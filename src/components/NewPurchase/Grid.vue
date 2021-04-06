<template>
    <div class="grid-wrapper">
        <Grid ref="grid"
              :filterable="true"
              :filter="filter"
              @filterchange="filterChange"
              :data-items="getData"
              :edit-field="'inEdit'"
              @itemchange="itemChange"
              :columns="columns">
            <template v-slot:myDropDownCell="{props}">
                <ddcell :data-item="props.dataItem"
                        :field="props.field"
                        @change="(e) => ddChange(e, props.dataItem)"/>
            </template>
            <template v-slot:myTemplate="{props}">
                <custom :data-item="props.dataItem"
                        @save="save(props)"
                        @cancel="cancel"/>
            </template>
            <grid-toolbar>
                <div>
                    <button title="Add new" class="k-button primary-btn new-product-btn"
                            :class="{'pointer-events-none': editID}"
                            :disabled="editID? true: false"
                            @click.prevent='addRecord'>
                        <svg>
                            <use xlink:href="@/assets/images/sprite.svg#add"></use>
                        </svg>
                        {{$t('newProduct')}}
                    </button>
                </div>
            </grid-toolbar>
        </Grid>
        <p class="text-danger" v-for="key in Object.keys(errors)" :key="key">
            - {{ errors[key] }}
        </p>
    </div>
</template>
<script>
    import {Grid, GridToolbar} from '@progress/kendo-vue-grid';
    import {filterBy} from '@progress/kendo-data-query';
    import CommandCell from './CommandCell';
    import DropDownCell from './DropDownCell';
    import Vue from 'vue'

    export default {
        props: ['warehouse'],
        components: {
            'Grid': Grid,
            'grid-toolbar': GridToolbar,
            'custom': CommandCell,
            'ddcell': DropDownCell,
        },
        data: function () {
            return {
                filter: {
                    logic: "and",
                    filters: [
                        // { field: "UnitPrice", operator: "neq", value: 18 },
                        // { field: "FirstOrderedOn", operator: "gte", value:new Date("1996-10-10") }
                    ]
                },
                updatedData: [],
                editID: null,
                group: [{field: 'qty'}],
                expandedItems: [],
                columns: [
                    {field: 'ProductName', title: 'Product'},
                    {field: 'qty', title: 'Total Required Quantity', editor: 'numeric'},
                    {field: 'uom', title: 'UOM', cell: 'myDropDownCell'},
                    {cell: 'myTemplate', title: 'Action', filterable: false}

                ],
                gridData: [
                    {
                        "ProductID": 1,
                        "ProductName": "Chai",
                        "qty": 39,
                        "uom": 'Strip',
                    }, {
                        "ProductID": 2,
                        "ProductName": "Chang",
                        "qty": 17,
                        "uom": 'Box',
                    }, {
                        "ProductID": 3,
                        "ProductName": "Aniseed Syrup",
                        "qty": 13,
                        "uom": 'Strip',
                    }, {
                        "ProductID": 4,
                        "ProductName": "Chef Anton's Cajun Seasoning",
                        "qty": 53,
                        "uom": 'Strip',
                    }
                ],
                errors: {},
            };
        },
        computed: {
            getData() {
                let x = this.gridData.map(
                    (item) => Object.assign({inEdit: item.ProductID === this.editID}, item));
                return filterBy(x, this.filter);

            }
        },
        watch: {
            'editID'() {
                this.$emit('addingProduct', this.editID)
            },
            'warehouse'() {
                this.editID = null;
                this.gridData = []
            }
        },
        methods: {
          /**
           * Method invoked when we filter data
           * @param ev
           */
            filterChange: function (ev) {
                this.filter = ev.filter;
            },

          /**
           * Method invoked when we change in form that add product
           * @param e
           */
            itemChange: function (e) {
                const data = this.gridData.slice();
                const index = data.findIndex(d => d.ProductID === e.dataItem.ProductID);
                data[index] = {...data[index], [e.field]: e.value};
                this.gridData = data;
                if (Object.hasOwnProperty.call(data[index], 'ProductName')) {
                    Vue.delete(this.errors, 'ProductName')
                }
                if (Object.hasOwnProperty.call(data[index], 'qty')) {
                    Vue.delete(this.errors, 'qty')
                }
                if (event.dataItem) {
                    event.dataItem[e.field] = e.value;
                }
            },

          /**
           * Method invoked when we click add product button
           */
          addRecord() {
                const newRecord = {ProductID: this.gridData.length + 1};
                const data = this.gridData.slice();
                data.unshift(newRecord);
                this.gridData = data;
                this.editID = newRecord.ProductID;
            },

          /**
           * Method invoked when we click in save button
           * Save data we add in the form, add it to gridData
           * @param props
           */
            save(props) {
                if (!props.dataItem['ProductName']) {
                    Vue.set(this.errors, 'ProductName', 'Product name is required')
                }
                if (!props.dataItem['qty']) {
                    Vue.set(this.errors, 'qty', 'Quantity is required')

                } else {
                    if (props.dataItem['qty'] <= 0) {
                        Vue.set(this.errors, 'qty', 'Quantity should be greater than 0')
                    }
                }
                if (!props.dataItem['uom']) {
                    Vue.set(this.errors, 'uom', 'UOM is required')
                }
                if (Object.keys(this.errors).length == 0) {
                    this.editID = null;
                    this.$emit('productAdded', true)
                }
            },

          /**
           * Method invoked when we cancel changes we add in the add product form
           */
          cancel() {
                this.gridData.splice(0, 1);
                this.editID = null
            },

          /**
           * Method invoked when we select an option from UOM select
           * @param e
           * @param dataItem
           */
            ddChange: function (e, dataItem) {
                const index = this.gridData.findIndex(d => d.ProductID === dataItem.ProductID);
                Vue.set(this.gridData[index], 'uom', e.target.value);
                Vue.delete(this.errors, 'uom')
            },
        }
    };

</script>
<style scoped>
    .grid-wrapper {
        margin-bottom: 40px;
    }
</style>