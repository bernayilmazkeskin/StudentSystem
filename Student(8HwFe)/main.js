document.addEventListener('DOMContentLoaded', function () {
    const apiBaseUrl = 'https://localhost:7006/api/Student';
    let students = [];
    loadStudents();
    document.getElementById('saveStudentBtn').addEventListener('click', addStudent);
    document.getElementById('updateStudentBtn').addEventListener('click', updateStudent);

    async function loadStudents() {
        try {
            showLoading(true);
            const response = await fetch(apiBaseUrl);
            if (!response.ok) throw new Error('Veri yüklenemedi');

            students = await response.json();
            renderStudents(students);
        } catch (error) {
            showAlert('danger', 'Öğrenci listesi yüklenirken hata oluştu: ');
        } finally {
            showLoading(false);
        }
    }

    function renderStudents(students) {
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';

        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Kayıtlı Öğrenci bulunamadı</td></tr>';
            return;
        }

        students.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.studentNumber}</td>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.class}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-warning me-2 edit-btn" data-id="${student.id}">
                        <i class="bi bi-pencil"></i> Düzenle
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${student.id}">
                        <i class="bi bi-trash"></i> Sil
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });


        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const studentId = parseInt(this.getAttribute('data-id'));
                editStudent(studentId);
            });
        });


        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const studentId = parseInt(this.getAttribute('data-id'));
                deleteStudent(studentId);
            });
        });
    }

    async function addStudent() {
        const form = document.getElementById('addStudentForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const student = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            studentNumber: document.getElementById('studentNumber').value,
            class: document.getElementById('class').value
        };

        try {
            const response = await fetch(apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });

            if (!response.ok) throw new Error('Öğrenci eklenemedi');

            const result = await response.json();
            showAlert('success', 'Öğrenci başarıyla eklendi');


            bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
            form.reset();
            form.classList.remove('was-validated');


            loadStudents();
        } catch (error) {
            showAlert('danger', 'Öğrenci eklenirken hata oluştu: ' );
        }
    }

    function editStudent(studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        document.getElementById('editId').value = student.id;
        document.getElementById('editFirstName').value = student.firstName;
        document.getElementById('editLastName').value = student.lastName;
        document.getElementById('editStudentNumber').value = student.studentNumber;
        document.getElementById('editClass').value = student.class;

        const editModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
        editModal.show();
    }

    async function updateStudent() {
        const form = document.getElementById('editStudentForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const student = {
            id: parseInt(document.getElementById('editId').value),
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            studentNumber: document.getElementById('editStudentNumber').value,
            class: document.getElementById('editClass').value
        };

        try {
            const response = await fetch(`${apiBaseUrl}/${student.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });

            if (!response.ok) throw new Error('Güncelleme başarısız');

            showAlert('success', 'Öğrenci başarıyla güncellendi');


            bootstrap.Modal.getInstance(document.getElementById('editStudentModal')).hide();


            loadStudents();
        } catch (error) {
            showAlert('danger', 'Güncelleme sırasında hata oluştu: ' );
        }
    }

    async function deleteStudent(studentId) {
        if (!confirm('Bu öğrenciyi silmek istediğinize emin misiniz?')) return;

        try {
            const response = await fetch(`${apiBaseUrl}/${studentId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Silme işlemi başarısız');

            showAlert('success', 'Öğrenci başarıyla silindi');
            loadStudents();
        } catch (error) {
            showAlert('danger', 'Silme işlemi sırasında hata oluştu: ' );
        }
    }

    function showAlert(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        alertDiv.style.zIndex = '1100';
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 5000);
    }

    function showLoading(show) {
        const loadingDiv = document.getElementById('loadingSpinner') || createLoadingSpinner();
        loadingDiv.style.display = show ? 'block' : 'none';
    }

    function createLoadingSpinner() {
        const div = document.createElement('div');
        div.id = 'loadingSpinner';
        div.className = 'loading-spinner';
        div.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Yükleniyor...</span>
            </div>
            <p class="mt-2">Yükleniyor...</p>
        `;
        document.getElementById('studentsTableBody').after(div);
        return div;
    }
});