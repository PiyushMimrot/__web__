import Swal from 'sweetalert2';

export function SwalAlert({ title, text, icon, timer }) {

  return (
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      timer: timer
    })
  )
}
