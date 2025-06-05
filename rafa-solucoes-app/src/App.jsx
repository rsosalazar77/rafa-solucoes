import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";

export default function Home() {
  const materiaisComPreco = {
    "ACM Basico": 110.0,
    "ACM Especial": 135.0,
    "PVC branco 5mm": 70.0,
    "PVC Branco 10mm": 120.0,
    "PVC Branco 15mm": 160.0,
    "PVC Branco 20mm": 200.0,
    "PVC Branco 30mm": 380.0,
    "Acrílico Transparente 2mm": 120.0,
    "Acrílico Transparente 3mm": 160.0,
    "Acrílico Transparente 5mm": 300.0,
    "Acrílico Cor 2mm": 145.0,
    "Acrílico Cor 3mm": 200.0,
    "Acrílico Espelhado 2mm": 210.0,
    "PS 2mm": 50.0,
    "MDF 15mm": 200.0,
    "PVC preto 10mm": 130.0,
    "PVC preto 20mm": 250.0
  };

  const materiais = Object.keys(materiaisComPreco);

  const [cliente, setCliente] = useState({ nome: "" });
  const [item, setItem] = useState({ material: "", largura: "", altura: "", quantidade: 1, valorM2: 0 });
  const [incluirAcabamento, setIncluirAcabamento] = useState(false);
  const [incluirInstalacao, setIncluirInstalacao] = useState(false);
  const [valorAcabamento, setValorAcabamento] = useState(100);
  const [valorInstalacao, setValorInstalacao] = useState(0);
  const [orcamento, setOrcamento] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (item.material && materiaisComPreco[item.material]) {
      setItem((prev) => ({ ...prev, valorM2: materiaisComPreco[item.material] }));
    }
  }, [item.material]);

  const calcularOrcamento = () => {
    if (!cliente.nome || !item.material || !item.largura || !item.altura || !item.quantidade) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    const area = (parseFloat(item.largura) * parseFloat(item.altura)) / 10000;
    const valorMaterial = parseFloat(item.valorM2);
    const totalMaterial = area * valorMaterial * parseInt(item.quantidade);
    const totalAcabamento = incluirAcabamento ? area * parseFloat(valorAcabamento) : 0;
    const totalInstalacao = incluirInstalacao ? area * parseFloat(valorInstalacao) : 0;
    const valorCorte = area * (100 + valorMaterial * 0.1);
    const total = totalMaterial + totalAcabamento + totalInstalacao + valorCorte;

    const novoOrcamento = {
      ...cliente,
      ...item,
      area,
      total,
      incluirAcabamento,
      incluirInstalacao,
      valorAcabamento,
      valorInstalacao,
      totalAcabamento,
      totalInstalacao,
      valorCorte,
      data: new Date().toLocaleString(),
    };
    setOrcamento(novoOrcamento);
    setHistorico([novoOrcamento, ...historico]);
    setErro("");
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Orçamento - Rafa Soluções", 20, 20);

    doc.setFontSize(12);
    doc.text(`Cliente: ${cliente.nome}`, 20, 40);
    doc.text(`Material: ${item.material}`, 20, 80);
    doc.text(`Dimensões: ${item.largura}cm x ${item.altura}cm`, 20, 90);
    doc.text(`Quantidade: ${item.quantidade}`, 20, 100);
    doc.text(`Área Total: ${orcamento?.area.toFixed(2)} m²`, 20, 110);
    doc.text(`Valor por m²: R$ ${item.valorM2}`, 20, 120);
    doc.text(`Valor do Corte: R$ ${orcamento?.valorCorte.toFixed(2)}`, 20, 125);
    doc.text(
      `Acabamento e Pintura: ${orcamento?.incluirAcabamento ? `Sim (R$ ${(orcamento.totalAcabamento).toFixed(2)})` : "Não"}`,
      20,
      130
    );
    doc.text(
      `Instalação: ${orcamento?.incluirInstalacao ? `Sim (R$ ${(orcamento.totalInstalacao).toFixed(2)})` : "Não"}`,
      20,
      140
    );
    doc.setFontSize(14);
    doc.text(`Total: R$ ${orcamento?.total.toFixed(2)}`, 20, 160);

    doc.save(`orcamento-${cliente.nome.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  const limparFormulario = () => {
    setCliente({ nome: "" });
    setItem({ material: "", largura: "", altura: "", quantidade: 1, valorM2: 0 });
    setIncluirAcabamento(false);
    setIncluirInstalacao(false);
    setValorAcabamento(100);
    setValorInstalacao(0);
    setOrcamento(null);
    setErro("");
  };

  const removerOrcamentoDoHistorico = (index) => {
    const novoHistorico = historico.filter((_, i) => i !== index);
    setHistorico(novoHistorico);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Rafa Soluções - Orçamento</h1>

      {erro && <p className="text-red-600 font-medium text-center">{erro}</p>}

      {/* Formulário e conteúdo continuam... */}
    </div>
  );
}