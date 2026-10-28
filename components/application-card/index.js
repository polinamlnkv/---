import { showToast } from "../../utils/toast.js";

export class ApplicationCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="card app-card" id="card-${data.id}">
                    <button class="card-delete-btn" id="delete-app-${data.id}" data-id="${data.id}" title="Удалить заявку">✕</button>
                    <div class="card-body">
                        <div class="app-avatar" style="background:${data.color}">${data.initials}</div>
                        <h5 class="card-title">${data.nickname}</h5>
                        <h6 class="card-subtitle">${data.location}</h6>
                        <span class="badge status" id="status-${data.id}">${data.status}</span>
                        <p class="card-text">Карт в заявке: ${data.maps.length}</p>
                        <div class="app-card-actions">
                            <button class="btn btn-primary" id="open-app-${data.id}" data-id="${data.id}">Подробнее</button>
                            <button class="btn btn-find-match" id="find-match-${data.id}" data-id="${data.id}">🎮 Найти матч</button>
                        </div>
                    </div>
                </div>
            `
        )
    }

    addListeners(data, listener) {
        document
            .getElementById(`open-app-${data.id}`)
            .addEventListener("click", listener)
    }

    addDeleteListener(data, deleteListener) {
        document
            .getElementById(`delete-app-${data.id}`)
            .addEventListener("click", deleteListener)
    }

    // "Прикольная" фича №2: имитация поиска матча — спиннер,
    // случайная задержка, затем тост с результатом и живое
    // обновление статуса заявки прямо в карточке.
    addMatchFinderListener(data) {
        const button = document.getElementById(`find-match-${data.id}`)
        const statusBadge = document.getElementById(`status-${data.id}`)
        const originalButtonHTML = button.innerHTML

        button.addEventListener('click', () => {
            if (button.disabled) return

            button.disabled = true
            button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Поиск...'
            statusBadge.textContent = 'В поиске'
            statusBadge.classList.add('searching')

            const searchTime = 1200 + Math.random() * 1800 // 1.2–3 секунды

            setTimeout(() => {
                const ping = Math.floor(18 + Math.random() * 55)
                statusBadge.textContent = 'Матч найден'
                statusBadge.classList.remove('searching')
                button.disabled = false
                button.innerHTML = originalButtonHTML

                showToast(`${data.nickname}: матч найден! Пинг ${ping} мс`)
            }, searchTime)
        })
    }

    render(data, listener, deleteListener) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(data, listener)
        this.addMatchFinderListener(data)
        this.addDeleteListener(data, deleteListener)
    }
}
