import { ref, computed } from "vue";


export default function useValidationForm() {
  const email = ref("");
  const password = ref("");
  const error = ref("");
  const visible = ref("password");
  const wrongValues = ref(false);
  const wrongData = ref(false);

  return {
    email,
    password,
    error,
    visible,
    wrongValues,
    wrongData
  }

}
