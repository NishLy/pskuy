export interface ROOM_DATA {
  id?: number;
  id_rental?: number;
  id_console?: string;
  id_joystick_first_person?: string | null;
  id_joystick_second_person?: string | null;
  console_production_year?: number;
  status?: TypeFunctionalityStatus;
  information?: string;
  price_per_hour?: number;
  rating?: number;
  active?: boolean;
  is_rented?: boolean;
  time_end_current_rent?: string | null;
  times_viewed?: number;
  times_booked?: number;
  images_directory?: string;
}
