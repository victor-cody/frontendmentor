const shareBtnClass = "article-card__share-btn";
const shareTooltipClass = "article-card__share-tooltip";
const authorDateClass = "article-card__author-date-container";

const shareBtn = document.querySelector("." + shareBtnClass);
const shareTooltip = document.querySelector("." + shareTooltipClass);
const authorDate = document.querySelector("." + authorDateClass);

/**
 * Toggles the visibility of the share tooltip,
 * toggles the *--active class and aria-expanded attribute on the share btn,
 * toggles the visibilty of the author-date container on a mobile only.
 *
 * Note that on a mobile, the share tooltip and author-date container
 * can't be both hidden or visible.
 */
function toggleShareTooltip() {
  shareTooltip.classList.toggle(`${shareTooltipClass}--hidden`);
  authorDate.classList.toggle(`${authorDateClass}--hidden-mobile`);

  const isTooltipOpen = shareBtn.classList.toggle(`${shareBtnClass}--active`);

  shareBtn.setAttribute("aria-expanded", isTooltipOpen);
}

shareBtn.addEventListener("click", toggleShareTooltip);

// When share tooltip is open (this condition is important!) and
// user clicks outside it (but not on share btn),
// close share tooltip.
document.addEventListener("click", function (e) {
  const isShareButtonClicked = e.target.closest("." + shareBtnClass) !== null;
  const isTooltipClicked = e.target.closest("." + shareTooltipClass) !== null;
  const isTooltipOpen = shareBtn.classList.contains(`${shareBtnClass}--active`);

  if (isTooltipOpen && !isTooltipClicked && !isShareButtonClicked) {
    toggleShareTooltip();
  }
});

/**
 * The keydown and blur events below would conflict without this.
 * With this, we can ignore the blur event if the blur was caused by pressing the esc key.
 */
let ignoreBlur = false;

// When share tooltip is open (this condition is important!) and
// user presses the esc key, close share tooltip.
document.addEventListener("keydown", function (e) {
  const isTooltipOpen = shareBtn.classList.contains(`${shareBtnClass}--active`);

  if (isTooltipOpen && e.key === "Escape") {
    ignoreBlur = true;
    toggleShareTooltip();
  }
});

// Hide the share tooltip when focus leaves the links within it.
shareTooltip
  .querySelectorAll(".article-card__social-icon-link")
  .forEach((socialLink) => {
    socialLink.addEventListener("blur", function (e) {
      // Get the "share tooltip" ancestor of the next focused element, if any.
      // (See https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)
      const tooltip = e.relatedTarget?.closest("." + shareTooltipClass);

      if (!ignoreBlur && !tooltip) {
        toggleShareTooltip();
      }

      ignoreBlur = false;
    });
  });