import { motion } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

interface EDILine {
  number: number;
  content: string;
  hasError?: boolean;
  errorMessage?: string;
}

const sampleEDILines: EDILine[] = [
  { number: 1, content: "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *230101*1200*^*00501*000000001*0*P*:~" },
  { number: 2, content: "GS*HC*SENDER*RECEIVER*20230101*1200*1*X*005010X222A1~" },
  { number: 3, content: "ST*837*0001*005010X222A1~" },
  { number: 4, content: "BHT*0019*00*12345*20230101*1200*CH~" },
  { number: 5, content: "NM1*85*1*DOE*JOHN****XX*1234567890~" },
  { number: 6, content: "N3*123 MAIN STREET~" },
  { number: 7, content: "N4*SAN FRANCISCO*CA*9410~", hasError: true, errorMessage: "Invalid ZIP code format – expected 5 or 9 digits" },
  { number: 8, content: "REF*EI*123456789~" },
  { number: 9, content: "NM1*IL*1*SMITH*JANE****MI*ABC123456~" },
  { number: 10, content: "DMG*D8*19800115*F~" },
  { number: 11, content: "CLM*CLAIM001*ABC*11:B:1*Y*A*Y*Y~", hasError: true, errorMessage: "Claim amount mismatch – expected numeric value, found 'ABC'" },
  { number: 12, content: "DTP*472*D8*20230101~" },
  { number: 13, content: "SV1*HC:99213**UN*1***1~", hasError: true, errorMessage: "Missing procedure code modifier" },
  { number: 14, content: "DTP*472*D8*20230101~" },
  { number: 15, content: "SE*14*0001~" },
  { number: 16, content: "GE*1*1~" },
  { number: 17, content: "IEA*1*000000001~" },
];

interface Props {
  onClose: () => void;
  errorLine?: number;
}

const EDIDocumentViewer = ({ onClose, errorLine }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[80vh] bg-card text-foreground border border-border/30 rounded-xl overflow-hidden shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground font-mono">sample_837_claim.edi</span>
            <span className="text-xs text-muted-foreground">— 17 lines</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Code viewer */}
        <div className="flex-1 overflow-auto p-0 font-mono text-xs">
          {sampleEDILines.map((line) => (
            <div
              key={line.number}
              id={`edi-line-${line.number}`}
              className={`flex group relative ${
                line.hasError
                  ? "bg-destructive/10 border-l-2 border-destructive"
                  : "border-l-2 border-transparent hover:bg-muted/20"
              }`}
            >
              <span className="w-10 shrink-0 text-right pr-3 py-1 text-foreground/70 select-none border-r border-border/30">
                {line.number}
              </span>
              <span className={`flex-1 py-1 pl-3 pr-4 ${line.hasError ? "text-destructive" : "text-foreground/80"} whitespace-pre overflow-x-auto`}>
                {line.content}
              </span>
              {line.hasError && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-destructive/20 border border-destructive/30 text-destructive text-[10px] whitespace-nowrap">
                    <AlertCircle className="w-3 h-3" />
                    {line.errorMessage}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EDIDocumentViewer;
