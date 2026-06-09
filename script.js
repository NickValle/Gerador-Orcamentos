window.gerarPDF = gerarPDF;
window.limparFormulario = limparFormulario;
window.calcularTotal = calcularTotal;

document.addEventListener("DOMContentLoaded", function () {
    const inputSubtotal = document.getElementById('subtotal');
    const inputAcrescimo = document.getElementById('acrescimo');
    const inputDesconto = document.getElementById('desconto');

    if (inputSubtotal && inputAcrescimo && inputDesconto) {
        inputSubtotal.addEventListener('input', calcularTotal);
        inputAcrescimo.addEventListener('input', calcularTotal);
        inputDesconto.addEventListener('input', calcularTotal);
    }
    calcularTotal();
});

function calcularTotal() {
    const subtotal = parseFloat(document.getElementById('subtotal').value) || 0;
    const acrescimo = parseFloat(document.getElementById('acrescimo').value) || 0;
    const desconto = parseFloat(document.getElementById('desconto').value) || 0;
    const totalGeral = subtotal + acrescimo - desconto;
    const campoTotal = document.getElementById('total');
    if (campoTotal) {
        campoTotal.value = totalGeral.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

function limparFormulario() {
    if (confirm("Tem certeza que deseja limpar todos os campos preenchidos?")) {
        const formulario = document.getElementById('orcamentoForm');
        if (formulario) {
            formulario.reset();
            calcularTotal();
        }
    }
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const dadosEmpresa = {
        nome: "JM COBERTAS",
        cnpj: "36.757.892/0001-17",
        endereco: "Avenida Engenheiro Humberto Monte, 2929\nSala 602 Bs2, Pici, Fortaleza - Ceará, 60440-593",
        telefone: "(85) 988163349",
        email: "jmesquadrias22@hotmail.com",
        site: "..."
    };

    const formatarData = (dataStr) => {
        if (!dataStr) return '---';
        const partes = dataStr.split('-');
        if (partes.length !== 3) return dataStr;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };

    const numeroOrcamento = document.getElementById('numeroOrcamento').value || '---';
    const dataOrcamento = formatarData(document.getElementById('dataOrcamento').value);
    const validadeOrcamento = formatarData(document.getElementById('validadeOrcamento').value);

    const nomeCliente = document.getElementById('nomeCliente').value || '---';
    const telefoneCliente = document.getElementById('telefoneCliente').value || '---';
    const emailCliente = document.getElementById('emailCliente').value || '---';
    const cpfCliente = document.getElementById('cpfCliente').value || '---';
    const enderecoCliente = document.getElementById('enderecoCliente').value || '---';

    const servico = document.getElementById('servico').value || '---';

    const formatarMoeda = (id) => {
        const val = parseFloat(document.getElementById(id).value) || 0;
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const subtotalTxt = formatarMoeda('subtotal');
    const acrescimoTxt = formatarMoeda('acrescimo');
    const descontoTxt = formatarMoeda('desconto');
    const totalTxt = document.getElementById('total').value;

    const observacoes = document.getElementById('observacoes').value || '';
    const formaPagamento = document.getElementById('formaPagamento').value || '---';

    const estiloGrade = {
        theme: 'plain',
        styles: { lineColor:[220, 220, 220], lineWidth: 0.3, textColor:[30,30,30], fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor:[255,255,255], fontStyle: 'bold', textColor: [40, 40, 40] }
    };

    //imagem logo
    const logoBase64 = "data:image/png;base64,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";
    doc.addImage(logoBase64, 'PNG', 14, 10, 30, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(dadosEmpresa.nome, 50, 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(dadosEmpresa.cnpj, 50, 19);
    doc.text(dadosEmpresa.endereco, 50, 24);

    doc.text(dadosEmpresa.telefone, 196, 14, { align: "right" });
    doc.text(dadosEmpresa.email, 196, 19, { align: "right" });
    doc.text(dadosEmpresa.site, 196, 24, { align: "right" });

    let currentY = 38;

    doc.autoTable({
        startY: currentY,
        ...estiloGrade,
        head: [[`Orçamento: ${numeroOrcamento}`, `Data: ${dataOrcamento}`, `Validade: ${validadeOrcamento}`]],
        headStyles: { ...estiloGrade.headStyles, halign: 'center' }
    });
    currentY = doc.lastAutoTable.finalY + 4;

    doc.autoTable({
        startY: currentY,
        ...estiloGrade,
        head: [[{ content: 'Dados do cliente', colSpan: 4, styles: { halign: 'center' } }]],
        body: [
            [{ content: 'Nome', styles: { fontStyle: 'bold' } }, { content: nomeCliente, colSpan: 3 }],
            [{ content: 'Telefone', styles: { fontStyle: 'bold' } }, telefoneCliente, { content: 'Email', styles: { fontStyle: 'bold' } }, emailCliente],
            [{ content: 'CPF / CNPJ', styles: { fontStyle: 'bold' } }, { content: cpfCliente, colSpan: 3 }],
            [{ content: 'Endereço', styles: { fontStyle: 'bold' } }, { content: enderecoCliente, colSpan: 3 }]
        ],
        columnStyles: { 0: { cellWidth: 25 }, 2: { cellWidth: 25 } }
    });
    currentY = doc.lastAutoTable.finalY + 4;

    doc.autoTable({
        startY: currentY,
        ...estiloGrade,
        head: [
            [{ content: 'Itens', colSpan: 2, styles: { halign: 'center' } }],
            ['# Descrição do Serviço prestado', 'Total']
        ],
        body: [
            [{ content: servico, styles: { cellPadding: 5 } }, { content: totalTxt, styles: { fontStyle: 'bold', halign: 'right', valign: 'middle', cellWidth: 40 } }]
        ]
    });
    currentY = doc.lastAutoTable.finalY + 4;

    doc.autoTable({
        startY: currentY,
        ...estiloGrade,
        body: [[
            { content: `Subtotal: ${subtotalTxt}`, styles: { fontStyle: 'bold', halign: 'center' } },
            { content: `Acréscimo: ${acrescimoTxt}`, styles: { fontStyle: 'bold', halign: 'center' } },
            { content: `Desconto: ${descontoTxt}`, styles: { fontStyle: 'bold', halign: 'center' } },
            { content: `Total: ${totalTxt}`, styles: { fontStyle: 'bold', halign: 'center', textColor: [0, 217, 95] } } // verde no total para destaque
        ]]
    });
    currentY = doc.lastAutoTable.finalY + 4;

    const textoObservacoes = `Forma de pagamento: ${formaPagamento}\n\nObservações:\n${observacoes}`;
    doc.autoTable({
        startY: currentY,
        ...estiloGrade,
        head: [[{ content: 'Observações', styles: { halign: 'center' } }]],
        body: [[{ content: textoObservacoes, styles: { cellPadding: 5 } }]]
    });
    currentY = doc.lastAutoTable.finalY + 25;

    doc.setLineWidth(0.3);
    doc.setDrawColor(220, 220, 220);

    doc.line(25, currentY, 85, currentY);
    doc.text(dadosEmpresa.nome, 55, currentY + 5, { align: "center" });

    doc.line(125, currentY, 185, currentY);
    doc.text(nomeCliente, 155, currentY + 5, { align: "center" });

    doc.save(`Orcamento_${numeroOrcamento.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
}