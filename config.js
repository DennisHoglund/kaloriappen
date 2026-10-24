// Delar Supabase-projekt med Jaktvind och Svampkartan. Kaloriappens tabeller har prefixet kalori_
// och bucketen heter kalori-foton, så inget krockar med de andra apparnas data.
// Nyckeln är publik och får ligga i koden – skyddet sköts av RLS i databasen.
window.KALORI_CONFIG = {
  supabaseUrl: 'https://sjdznlmnvubqscftdkoj.supabase.co',
  supabaseAnonKey: 'sb_publishable_bKrpOKc38I20NvhC2vjmhw_YyZbm94Q'
};
