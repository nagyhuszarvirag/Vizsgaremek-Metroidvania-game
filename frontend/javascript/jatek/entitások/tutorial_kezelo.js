export  function TutorialHint(k, player) {
    const TUTORIAL_STORAGE_KEY = "tutorialDone";

    function tutorialAllapotBetolt() {
        return JSON.parse(localStorage.getItem(TUTORIAL_STORAGE_KEY) || "{}");
    }

    function tutorialAllapotMent(done) {
        localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(done));
    }

    let hint = null;

    function showHint(text) {
        if (hint) {
            hint.text = text;
            return;
        }

        hint = k.add([
            k.text(text, { size: 16 }),
            k.pos(player.pos.x, player.pos.y - 60),
            k.anchor("center"),
            k.fixed(),
            k.z(9999),
            "tutorial_hint",
        ]);
    }

    function hideHint() {
        if (hint && hint.exists()) {
            hint.destroy();
        }

        hint = null;
    }

    k.onUpdate(() => {
        if (hint && player.exists()) {
            const screenPos = k.toScreen(player.pos);
            hint.pos = k.vec2(screenPos.x, screenPos.y - 60);
        }
    });

    return {
        showHint,
        hideHint,

        isDone(key) {
            const done = tutorialAllapotBetolt();
            return done[key] === true;
        },

        markDone(key) {
            const done = tutorialAllapotBetolt();
            done[key] = true;
            tutorialAllapotMent(done);
            hideHint();
        },

        showOnce(key, text) {
            if (this.isDone(key)) return;
            showHint(text);
        },
    };
}