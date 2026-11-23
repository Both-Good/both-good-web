document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('h1').forEach(h1 => {
        if (h1.children.length) return; // leave headings with images (e.g. a game logo) alone
        let jigglyText = '';
        h1.textContent.split('').forEach(letter => {
            // inline-block spans swallow plain spaces, so keep them as real spaces
            jigglyText += letter === ' ' ? ' ' : `<span class="jiggly">${letter}</span>`;
        });
        h1.innerHTML = jigglyText;
    });
});
