import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    api: {
      type: String,
      required: true, // truyền từ ngoài vào
    },
  },

  data() {
    return {
      store: {
        data: [],
        total: 0,
      },
      loading: false,

      isShowForm: false,
      selectedRecord: {},
    };
  },

  computed: {
    rows() {
      return this.store.data ?? [];
    },

    totalRows() {
      return this.store.total ?? 0;
    },

    // auto detect rowKey (candidateId, employeeId...)
    rowKey() {
      if (!this.rows.length) return "id";

      const keys = Object.keys(this.rows[0]);
      return keys.find((k) => k.toLowerCase().endsWith("id"));
    },
  },

  methods: {
    async getData(params = {}) {
      try {
        this.loading = true;

        const res = await axios.get(this.api, { params });

        this.store.data = res.data.list ?? [];
        this.store.total = res.data.totalCount ?? 0; 
      } catch (err) {
        console.error("getStore error:", err);
      } finally {
        this.loading = false;
      }
    },

    async reload() {
      await this.getStore();
    },

   
    async getById(id) {
      const res = await axios.get(`${this.api}/${id}`);
      return res.data;
    },

    async add(payload) {
      return axios.post(this.api, payload);
    },

    async update(id, payload) {
      return axios.put(`${this.api}/${id}`, payload);
    },

    async remove(id) {
      return axios.delete(`${this.api}/${id}`);
    },

    async removeMultiple(ids) {
      return axios.post(`${this.api}/delete-multiple`, ids);
    },

    
    handleAdd() {
      this.selectedRecord = {};
      this.isShowForm = true;
    },

    /**
     * Mở form sửa - gọi API GetById lấy đầy đủ dữ liệu rồi mở form
     * @param {Object} row - Dòng dữ liệu cần sửa
     */
    async handleEdit(row) {
      try {
        this.loading = true;
        const keys = Object.keys(row);
        const idKey = keys.find((k) => k.toLowerCase().endsWith("id"));
        const id = row[idKey];

        const fullData = await this.getById(id);
        this.selectedRecord = { ...fullData };
        this.isShowForm = true;
      } catch (err) {
        console.error("handleEdit getById error:", err);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Đóng form
     */
    closeForm() {
      this.isShowForm = false;
      this.selectedRecord = {};
    },
  },

 
});
