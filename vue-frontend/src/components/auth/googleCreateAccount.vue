<template>
  <div>
    <!-- 검색 입력 -->
    <label for="country">Country</label>
    <input
      id="country"
      type="text"
      v-model="searchTerm"
      @input="filterCountries"
      placeholder="Search for your country"
      class="country-input"
    />

    <!-- 드롭다운 -->
    <ul v-if="filteredCountries.length && showDropdown" class="dropdown">
      <li
        v-for="country in filteredCountries"
        :key="country.cca2"
        @click="selectCountry(country.name.common)"
        class="dropdown-item"
      >
        {{ country.name.common }}
      </li>
    </ul>

    <!-- 선택된 국가 표시 -->
    <p v-if="selectedCountry" class="selected-country">
      Selected Country: {{ selectedCountry }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

// 상태 관리
const searchTerm = ref("");
const countries = ref([]);
const filteredCountries = ref([]);
const selectedCountry = ref("");
const showDropdown = ref(false);

// 국가 목록 가져오기 (API 호출)
const fetchCountries = async () => {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    countries.value = response.data.map((country) => ({
      name: country.name,
      cca2: country.cca2,
    }));
  } catch (error) {
    console.error("Failed to fetch countries:", error);
  }
};

// 국가 검색 필터링
const filterCountries = () => {
  if (searchTerm.value.trim()) {
    filteredCountries.value = countries.value.filter((country) =>
      country.name.common
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase())
    );
    showDropdown.value = true;
  } else {
    filteredCountries.value = [];
    showDropdown.value = false;
  }
};

// 국가 선택 핸들러
const selectCountry = (country) => {
  selectedCountry.value = country;
  searchTerm.value = country; // 검색창에 선택된 국가 표시
  showDropdown.value = false; // 드롭다운 숨기기
};

// 초기화
fetchCountries();
</script>