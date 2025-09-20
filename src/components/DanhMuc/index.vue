<template>
    <div class="row">

        <div class="col-lg-4 col-md-12">
            <div class="card">
                <div class="card-header">
                    <h6 class="mt-2"><b>THÊM MỚI DANH MỤC</b></h6>
                    <!-- <button class="btn btn-primary" v-on:click="loaddata()">KEKEKE</button> -->
                </div>
                <div class="card-body">
                    <div class="mb-2">
                        <label class="mb-1">Tên Danh Mục</label>
                        <input v-model="them_moi.ten_danh_muc" type="text" class="form-control">
                    </div>
                    <div class="mb-2">
                        <label class="mb-1">Slug Danh Mục</label>
                        <input v-model="them_moi.slug_danh_muc" type="text" class="form-control">
                    </div>
                    <div class="mb-2">
                        <label class="mb-1">Hình Ảnh</label>
                        <input v-model="them_moi.hinh_anh" type="text" class="form-control">
                    </div>
                    <div class="mb-2">
                        <label class="mb-1">Tình Trạng</label>
                        <select v-model="them_moi.tinh_trang" class="form-select">
                            <option value="1">Hiển Thị</option>
                            <option value="0">Tạm Dừng</option>
                        </select>
                    </div>
                </div>
                <div class="card-footer text-end">
                    <button class="btn btn-primary" v-on:click="add()">Thêm mới</button>
                </div>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mt-2"><b>DANH SÁCH DANH MỤC</b></h6>

                    </div>
                </div>
                <div class="card-body table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th class="text-center">#</th>
                                <th class="text-center">Tên Danh Mục</th>
                                <th class="text-center">Slug Danh Mục</th>
                                <th class="text-center">Hình Ảnh</th>
                                <th class="text-center">Tình Trạng</th>
                                <th class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(value, index) in list" :key="index">
                                <tr>
                                    <th class="align-middle text-center">{{ index + 1 }}</th>
                                    <td class="align-middle text-wrap">{{ value.ten_danh_muc }}</td>
                                    <td class="align-middle text-center">{{ value.slug_danh_muc }}</td>
                                    <th class="align-middle text-center">
                                        <img style="max-height: 100px;" v-bind:src="value.hinh_anh" class="img-fluid"
                                            alt="">
                                    </th>
                                    <td class="align-middle text-wrap text-center">
                                        <button v-if="value.tinh_trang == 1" class="btn btn-success text-nowrap ">Hiển
                                            Thị</button>
                                        <button v-else class="btn btn-danger text-nowrap ">Tạm tắt</button>
                                    </td>
                                    <td class="align-middle text-center">
                                        <button class="btn btn-primary me-2" data-bs-toggle="modal"
                                            data-bs-target="#capNhatDanhMuc">Cập
                                            nhật</button>
                                        <button v-on:click="Object.assign(danh_muc_can_xoa, value)"
                                            class="btn btn-danger" data-bs-toggle="modal"
                                            data-bs-target="#delNgheSi">Xóa</button>
                                    </td>
                                </tr>
                            </template>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Cập Nhật -->
    <div class="modal fade" id="capNhatDanhMuc" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Cập Nhật Danh Mục</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-2">
                        <label class="mb-1">Tên Danh Mục</label>
                        <input type="text" class="form-control">
                    </div>
                    <div class="mb-2">
                        <label class="mb-1">Slug Danh Mục</label>
                        <input type="text" class="form-control">
                    </div>
                    <div class="mb-2">
                        <label class="mb-1">Hình Ảnh</label>
                        <input type="text" class="form-control">
                    </div>
                    <div class="mb-2">
                        <label class="mb-1">Tình Trạng</label>
                        <select class="form-select">
                            <option value="1">Hiển Thị</option>
                            <option value="0">Tạm Dừng</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cập
                        nhật</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Xóa -->
    <div class="modal fade" id="delNgheSi" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Xóa Danh Mục</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger border-0 bg-danger alert-dismissible fade show py-2">
                        <div class="d-flex align-items-center">
                            <div class="font-35 text-white"><i class="bx bxs-message-square-x"></i>
                            </div>
                            <div class="ms-3">
                                <div class="text-white">Bạn có chắc chắc chắn muốn xóa {{ danh_muc_can_xoa.ten_danh_muc }} 
                                    này
                                    không?
                                </div>
                                <div class="text-white"><b>Lưu ý:</b>Điều này không thể hoàn tác!!</div>
                            </div>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button v-on:click="del()" type="button" class="btn btn-danger" data-bs-dismiss="modal">Xóa</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            list: [
                { id: 1, ten_danh_muc: 'Thiết bị điện tử', slug_danh_muc: 'thiet-bi-dien-tu', hinh_anh: 'https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5_tn', tinh_trang: 1 },
                { id: 2, ten_danh_muc: 'Thiết bị gia đình', slug_danh_muc: 'thiet-bi-gia-dinh', hinh_anh: 'https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5_tn', tinh_trang: 1 },
                { id: 3, ten_danh_muc: 'Thiết bị vệ sinh', slug_danh_muc: 'thiet-bi-ve-sinh', hinh_anh: 'https://down-vn.img.susercontent.com/file/978b9e4cb61c611aaaf58664fae133c5_tn', tinh_trang: 0 },
            ],
            them_moi: {
                ten_danh_muc: "",
                slug_danh_muc: "",
                hinh_anh: "",
                tinh_trang: 1

            },
            danh_muc_can_xoa: {}
        }
    },
    mounted() {
        this.loaddata();
    },
    methods: {
        add() {
            axios
                .post("https://ontap-khoa21.dzfullstack.edu.vn/api/danh-muc/create", this.them_moi)
                .then((res) => {
                    if (res.data.status) {
                        this.loaddata();
                        alert(res.data.message);
                        this.them_moi = {
                            ten_danh_muc: "",
                            slug_danh_muc: "",
                            hinh_anh: "",
                            tinh_trang: 1

                        }
                    }
                })
            // this.list.push(this.them_moi);


            // }
        },

        loaddata() {
            axios
                .get("https://ontap-khoa21.dzfullstack.edu.vn/api/danh-muc/data")
                .then((res) => {
                    this.list = res.data.data;

                })
                .catch((err) => {
                    console.log(err);

                }
                );


        },
        del() {
            axios
            .post("https://ontap-khoa21.dzfullstack.edu.vn/api/danh-muc/delete", this.danh_muc_can_xoa)
            .then((res)=>{
                if(res.data.status){
                    alert(res.data.message);
                    this.loaddata();
                }
            })
            .catch((err) =>{
                console.log(err);
                
            });
        }

    },
}
</script>
<style></style>
