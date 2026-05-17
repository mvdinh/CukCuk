/* src/components/ms-table/useTableFilter.js */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useFilterStore } from '../../../stores/filterStore';

export function useTableFilter(props, emit) {
  const filterStore = useFilterStore();
  
  const hoveredKey = ref(null);
  const activeFilterKey = ref(null);
  const filters = reactive({});

  const localFilter = reactive({
    operator: "contains",
    value: "",
  });

  onMounted(() => {
    if (props.fields) {
      props.fields.forEach((f) => {
        if (f.key) {
          filters[f.key] = filterStore.columnFilters[f.key]?.value || "";
        }
      });
    }
    document.addEventListener("click", handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  const handleFilterInput = () => {
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filterStore.setFilter(key, {
          operator: filterStore.columnFilters[key]?.operator || "contains",
          value: filters[key],
          active: true,
        });
      } else {
        filterStore.removeFilter(key);
      }
    });
    emit("filter", filterStore.columnFilters);
  };

  const toggleFilterPopup = (key) => {
    if (activeFilterKey.value === key) {
      activeFilterKey.value = null;
    } else {
      activeFilterKey.value = key;
      const current = filterStore.columnFilters[key] || {
        operator: "contains",
        value: "",
      };
      localFilter.operator = current.operator;
      localFilter.value = current.value;
    }
  };

  const isFilterActive = (key) => {
    return (
      filterStore.columnFilters[key]?.active &&
      filterStore.columnFilters[key]?.value
    );
  };

  const applyLocalFilter = () => {
    filterStore.setFilter(activeFilterKey.value, {
      operator: localFilter.operator,
      value: localFilter.value,
      active: true,
    });
    activeFilterKey.value = null;
    emit("filter", filterStore.columnFilters);
  };

  const clearLocalFilter = () => {
    filterStore.removeFilter(activeFilterKey.value);
    activeFilterKey.value = null;
    emit("filter", filterStore.columnFilters);
  };

  const handleClickOutside = (e) => {
    if (
      activeFilterKey.value &&
      !e.target.closest(".column-filter-popup") &&
      !e.target.closest(".header-filter-icon")
    ) {
      activeFilterKey.value = null;
    }
  };

  return {
    hoveredKey,
    activeFilterKey,
    filters,
    localFilter,
    handleFilterInput,
    toggleFilterPopup,
    isFilterActive,
    applyLocalFilter,
    clearLocalFilter
  };
}
