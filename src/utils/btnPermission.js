import store from "../store";

export function btnPermission(permission) {
  const btn = store.getters["app/btnPerm"];
  return btn.indexOf(permission) !== -1;
}
