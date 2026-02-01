export function fecthData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Hálózati hiba: " + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('A fetchel van a hiba:', error);
        });
    }

export function masikJSMeghivasa(src)
{
  const script = document.createElement('script');
  script.src = src;
  document.head.prepend(script);
}

export function oldalTakarito()
{
  document.body.innerHTML = "";
}

