export interface Event {
  bride: string;
  groom: string;
  wedding_date: string;
  hall_layout_image: string;
  tables: Table[];
}

export interface Table {
  table_no: string;
  id: number;
  seat_available: number;
  seat_assigned: number;
  position_x: number;
  position_y: number;
}

export interface Guest {
  table_id: string;
  table_no: string;
  name: string;
  member_count: number;
  avatar_url?: string;
}
