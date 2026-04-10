document.addEventListener("DOMContentLoaded", () => {
    const todoCard = document.querySelector('[data-testid="test-todo-card"]');
    const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
    const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
    const timeRemainingEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
    const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');
    const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
    const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

    const offsetMs = (3 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000);
    const dueTimeMs = Date.now() + offsetMs;
    const dueDate = new Date(dueTimeMs);

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    dueDateEl.textContent = `Due ${dueDate.toLocaleDateString('en-US', options)}`;
    dueDateEl.setAttribute('datetime', dueDate.toISOString());

    function updateTimeRemaining() {
        const now = Date.now();
        const diffMs = dueTimeMs - now;

        if (diffMs < 0) {
            const absDiff = Math.abs(diffMs);
            const hoursOverdue = Math.floor(absDiff / (1000 * 60 * 60));
            if (hoursOverdue > 0) {
                timeRemainingEl.textContent = `Overdue by ${hoursOverdue} hours`;
            } else {
                timeRemainingEl.textContent = "Overdue!";
            }
            timeRemainingEl.style.color = "var(--danger)";
            timeRemainingEl.style.backgroundColor = "var(--danger-bg)";
            return;
        }

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffMs / 1000 / 60) % 60);

        if (days > 1) {
            timeRemainingEl.textContent = `Due in ${days} days`;
        } else if (days === 1) {
            timeRemainingEl.textContent = "Due tomorrow";
        } else if (hours > 0) {
            timeRemainingEl.textContent = `Due in ${hours} hours`;
        } else if (minutes > 0) {
            timeRemainingEl.textContent = `Due in ${minutes} minutes`;
        } else {
            timeRemainingEl.textContent = "Due now!";
            timeRemainingEl.style.color = "var(--danger)";
            timeRemainingEl.style.backgroundColor = "var(--danger-bg)";
        }
    }

    updateTimeRemaining();
    setInterval(updateTimeRemaining, 30000);

    checkbox.addEventListener("change", (e) => {
        const isComplete = e.target.checked;
        if (isComplete) {
            todoCard.classList.add('completed');
            statusBadge.textContent = "Done";
            statusBadge.setAttribute("aria-label", "Status: Done");
        } else {
            todoCard.classList.remove('completed');
            statusBadge.textContent = "Pending";
            statusBadge.setAttribute("aria-label", "Status: Pending");
        }
    });

    const originalEditContent = editBtn.innerHTML;

    editBtn.addEventListener("click", () => {
        const titleEl = document.getElementById("todo-title-text");
        const descEl = document.getElementById("todo-desc-text");
        const isEditing = titleEl.isContentEditable;

        if (isEditing) {
            titleEl.contentEditable = "false";
            descEl.contentEditable = "false";
            editBtn.innerHTML = originalEditContent;
            titleEl.style.padding = "0";
            descEl.style.padding = "0";
            editBtn.style.color = "";
        } else {
            titleEl.contentEditable = "true";
            descEl.contentEditable = "true";
            titleEl.focus();

            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(titleEl);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);

            editBtn.textContent = "Save";
            editBtn.style.color = "var(--success)";
            titleEl.style.padding = "0 0.2rem 4px 0.2rem";
            descEl.style.padding = "0 0.2rem 4px 0.2rem";
        }
    });

    deleteBtn.addEventListener("click", () => {
        const confirmed = confirm("Are you sure you want to delete this task?");
        if (confirmed) {
            todoCard.style.transition = "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
            todoCard.style.opacity = "0";
            todoCard.style.transform = "scale(0.9) translateY(10px)";

            setTimeout(() => {
                todoCard.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding: 3rem 1rem; color: var(--muted); height: 100%;">
                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16" style="margin-bottom: 1rem; color: rgba(255,255,255,0.1);">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        <h3 style="color: var(--light-accent); margin: 0 0 0.5rem 0; font-family: var(--font-heading);">No Task Found</h3>
                        <p style="font-size: 0.95rem; margin: 0;">This task has been cleared.</p>
                    </div>
                `;
                todoCard.style.transform = "translate3d(0, 0, 0) scale(1)";
                todoCard.style.opacity = "1";
            }, 300);
        }
    });
});
