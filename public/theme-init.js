/* Apply the saved theme before styles render. Keep the existing light default. */
(function () {
  var preference = 'light';
  try {
    preference = localStorage.getItem('php2shell:theme') || 'light';
  } catch (_) {}
  var dark =
    preference === 'dark' ||
    (preference === 'system' &&
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#101c2b' : '#d9e2dc');
})();
